import { useEffect, useState } from "react";
import { ethers } from "ethers";

// Components
import HeaderNavigation from "./components/HeaderNavigation";
import PropertySearch from "./components/PropertySearch";
import PropertyDetails from "./components/PropertyDetails";

// ABIs
import PropertyRegistry from "./abis/PropertyRegistry.json";
import PropertyTransfer from "./abis/PropertyTransfer.json";

// Config
import config from "./config.json";

// Import property data from the houseData folder
import house1 from "./houseData/house1.json";
import house2 from "./houseData/house2.json";
import house3 from "./houseData/house3.json";

const App = () => {
  const [provider, setProvider] = useState(null);
  const [propertyTransfer, setPropertyTransfer] = useState(null);
  const [account, setAccount] = useState(null);
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState({});
  const [toggle, setToggle] = useState(false);

  const loadBlockchainData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);
    const network = await provider.getNetwork();

    const propertyRegistry = new ethers.Contract(
      config[network.chainId].propertyRegistry.address,
      PropertyRegistry,
      provider
    );
    const totalProperties = await propertyRegistry.totalProperties();

    const propertiesData = [house1, house2, house3];
    setProperties(propertiesData);

    const propertyTransfer = new ethers.Contract(
      config[network.chainId].propertyTransfer.address,
      PropertyTransfer,
      provider
    );
    setPropertyTransfer(propertyTransfer);

    console.log(
      `Total properties on the blockchain: ${totalProperties.toString()}`
    );

    window.ethereum.on("accountsChanged", async () => {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = ethers.utils.getAddress(accounts[0]);
      setAccount(account);
    });
  };

  useEffect(() => {
    loadBlockchainData();
  }, []);

  const togglePop = (property) => {
    setSelectedProperty(property);
    setToggle(!toggle);
  };

  return (
    <div className="app-container">
      <HeaderNavigation account={account} setAccount={setAccount} />
      <PropertySearch />

      <div className="cards__section">
        <h3>Available Properties</h3>
        <hr />

        <div className="cards">
          {properties.map((property, index) => (
            <div
              className="card"
              key={index}
              onClick={() => togglePop(property)}
            >
              <div className="card__image">
                <img src={property.image} alt="Property" />
              </div>
              <div className="card__info">
                <h4>{property.attributes[0].value} ETH</h4>
                <p>
                  <strong>{property.attributes[2].value}</strong> bds |
                  <strong>{property.attributes[3].value}</strong> ba |
                  <strong>{property.attributes[4].value}</strong> sqft
                </p>
                <p>{property.address}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {toggle && (
        <PropertyDetails
          property={selectedProperty}
          provider={provider}
          account={account}
          propertyTransfer={propertyTransfer}
          togglePop={togglePop}
        />
      )}
    </div>
  );
};

export default App;
