import { useEffect, useState } from "react";

import close_icon from "../assets/close-icon.svg";

const PropertyDetails = ({
  property,
  provider,
  account,
  propertyTransfer,
  togglePop,
}) => {
  const [hasBought, setHasBought] = useState(false);
  const [hasLended, setHasLended] = useState(false);
  const [hasInspected, setHasInspected] = useState(false);
  const [hasSold, setHasSold] = useState(false);

  const [propertyBuyer, setPropertyBuyer] = useState(null);
  const [loanProvider, setLoanProvider] = useState(null);
  const [inspector, setInspector] = useState(null);
  const [propertyOwner, setPropertyOwner] = useState(null);
  const [owner, setOwner] = useState(null);

  const fetchDetails = async () => {
    const propertyBuyer = await propertyTransfer.propertyBuyer(property.id);
    setPropertyBuyer(propertyBuyer);

    const hasBought = await propertyTransfer.approval(
      property.id,
      propertyBuyer
    );
    setHasBought(hasBought);

    const propertyOwner = await propertyTransfer.propertyOwner();
    setPropertyOwner(propertyOwner);

    const hasSold = await propertyTransfer.approval(property.id, propertyOwner);
    setHasSold(hasSold);

    const loanProvider = await propertyTransfer.loanProvider();
    setLoanProvider(loanProvider);

    const hasLended = await propertyTransfer.approval(
      property.id,
      loanProvider
    );
    setHasLended(hasLended);

    const inspector = await propertyTransfer.inspector();
    setInspector(inspector);

    const hasInspected = await propertyTransfer.inspectionPassed(property.id);
    setHasInspected(hasInspected);
  };

  const fetchOwner = async () => {
    if (await propertyTransfer.isListed(property.id)) return;
    const owner = await propertyTransfer.propertyBuyer(property.id);
    setOwner(owner);
  };

  const buyHandler = async () => {
    const propertyTransferAmount =
      await propertyTransfer.propertyTransferAmount(property.id);
    const signer = await provider.getSigner();

    // PropertyBuyer deposit earnest
    let transaction = await propertyTransfer
      .connect(signer)
      .downPayment(property.id, { value: propertyTransferAmount });
    await transaction.wait();

    // PropertyBuyer approves...
    transaction = await propertyTransfer
      .connect(signer)
      .approveSale(property.id);
    await transaction.wait();

    setHasBought(true);
  };

  const inspectHandler = async () => {
    const signer = await provider.getSigner();

    // Inspector updates status
    const transaction = await propertyTransfer
      .connect(signer)
      .updateInspectionStatus(property.id, true);
    await transaction.wait();

    setHasInspected(true);
  };

  const lendHandler = async () => {
    const signer = await provider.getSigner();

    // LoanProvider approves...
    const transaction = await propertyTransfer
      .connect(signer)
      .approveSale(property.id);
    await transaction.wait();

    // LoanProvider sends funds to contract...
    const lendAmount =
      (await propertyTransfer.purchasePrice(property.id)) -
      (await propertyTransfer.propertyTransferAmount(property.id));
    await signer.sendTransaction({
      to: propertyTransfer.address,
      value: lendAmount.toString(),
      gasLimit: 60000,
    });

    setHasLended(true);
  };

  const sellHandler = async () => {
    const signer = await provider.getSigner();

    // PropertyOwner approves...
    let transaction = await propertyTransfer
      .connect(signer)
      .approveSale(property.id);
    await transaction.wait();

    // PropertyOwner finalize...
    transaction = await propertyTransfer
      .connect(signer)
      .finalizeSale(property.id);
    await transaction.wait();

    setHasSold(true);
  };

  useEffect(() => {
    fetchDetails();
    fetchOwner();
  }, [hasSold]);

  return (
    <div className="property-details">
      <div className="property-details-content">
        <div className="property-image">
          <img src={property.image} alt="Home" />
        </div>

        <div className="property-overview">
          <h1>{property.name}</h1>
          <p>
            <strong>{property.attributes[2].value}</strong> bds |
            <strong>{property.attributes[3].value}</strong> ba |
            <strong>{property.attributes[4].value}</strong> sqft
          </p>
          <p>{property.address}</p>
          <h2>{property.attributes[0].value} ETH</h2>

          {owner ? (
            <div className="property-owned">
              Owned by {owner.slice(0, 6) + "..." + owner.slice(38, 42)}
            </div>
          ) : (
            <div>
              {account === inspector ? (
                <button
                  className="property-action-button"
                  onClick={inspectHandler}
                  disabled={hasInspected}
                >
                  Approve Inspection
                </button>
              ) : account === loanProvider ? (
                <button
                  className="property-action-button"
                  onClick={lendHandler}
                  disabled={hasLended}
                >
                  Approve & Lend
                </button>
              ) : account === propertyOwner ? (
                <button
                  className="property-action-button"
                  onClick={sellHandler}
                  disabled={hasSold}
                >
                  Approve & Sell
                </button>
              ) : (
                <button
                  className="property-action-button"
                  onClick={buyHandler}
                  disabled={hasBought}
                >
                  Buy
                </button>
              )}

              <button className="property-contact-agent">Contact agent</button>
            </div>
          )}

          <hr />
          <h2>Overview</h2>
          <p>{property.description}</p>
          <hr />
          <h2>Facts and features</h2>
          <ul>
            {property.attributes.map((attribute, index) => (
              <li key={index}>
                <strong>{attribute.trait_type}</strong> : {attribute.value}
              </li>
            ))}
          </ul>
        </div>

        <button onClick={togglePop} className="property-close-btn">
          <img src={close_icon} alt="Close" />
        </button>
      </div>
    </div>
  );
};

export default PropertyDetails;
