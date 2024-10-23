//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface IERC721 {
    function transferFrom(
        address _from,
        address _to,
        uint256 _id
    ) external;
}

contract PropertyTransfer {
    address public tokenAddress;
    address payable public propertyOwner;
    address public inspector;
    address public loanProvider;

    mapping(uint256 => bool) public isListed;
    mapping(uint256 => uint256) public purchasePrice;
    mapping(uint256 => uint256) public propertyTransferAmount;
    mapping(uint256 => address) public propertyBuyer;
    mapping(uint256 => bool) public inspectionPassed;
    mapping(uint256 => mapping(address => bool)) public approval;

    modifier onlyPropertyOwner() {
        require(msg.sender == propertyOwner, "You are NOT Owner of this Property");
        _;
    }

    modifier onlyPropertyBuyer(uint256 _propertyId) {
        require(msg.sender == propertyBuyer[_propertyId], "You are NOT Buyer of this Property");
        _;
    }

    modifier onlyInspector() {
        require(msg.sender == inspector, "Only Inspector");
        _;
    }

    constructor(
        address _tokenAddress,
        address payable _propertyOwner,
        address _inspector,
        address _loanProvider
    ) {
        tokenAddress = _tokenAddress;
        propertyOwner = _propertyOwner;
        inspector = _inspector;
        loanProvider = _loanProvider;
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function listProperty(
        uint256 _propertyId,
        address _propertyBuyer,
        uint256 _purchasePrice,
        uint256 _propertyTransferAmount
    ) public payable onlyPropertyOwner {
        //require(_purchasePrice > 0, "Price must be greater than 0");

        // Transfer Property from propertyOwner to this contract
        IERC721(tokenAddress).transferFrom(msg.sender, address(this), _propertyId);

        isListed[_propertyId] = true;
        purchasePrice[_propertyId] = _purchasePrice;
        propertyTransferAmount[_propertyId] = _propertyTransferAmount;
        propertyBuyer[_propertyId] = _propertyBuyer;
    }

    // Put Under Contract
    function downPayment(uint256 _propertyId) public payable onlyPropertyBuyer(_propertyId) {
        require(msg.value >= propertyTransferAmount[_propertyId], "Incorrect Down Payment");
    }

    function updateInspectionStatus(uint256 _propertyId, bool _passed)
        public
        onlyInspector
    {
        inspectionPassed[_propertyId] = _passed;
    }

    function approveSale(uint256 _propertyId) public {
        approval[_propertyId][msg.sender] = true;
    }

    function finalizeSale(uint256 _propertyId) public {
        require(inspectionPassed[_propertyId], "Inspection must be passed");
        require(approval[_propertyId][propertyBuyer[_propertyId]], "Buyer approval required");
        require(approval[_propertyId][propertyOwner], "Owner approval required");
        require(approval[_propertyId][loanProvider], "Loan Provider approval required");
        require(address(this).balance >= purchasePrice[_propertyId], "Insufficient funds");

        isListed[_propertyId] = false;

        (bool success, ) = payable(propertyOwner).call{value: address(this).balance}("");
        require(success, "Payment to owner failed");

        IERC721(tokenAddress).transferFrom(address(this), propertyBuyer[_propertyId], _propertyId);
    }

    function cancelSale(uint256 _propertyId) public {
        if (!inspectionPassed[_propertyId]) {
            payable(propertyBuyer[_propertyId]).transfer(address(this).balance);
        } else {
            payable(propertyOwner).transfer(address(this).balance);
        }
    }

    receive() external payable {}
}
