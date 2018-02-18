pragma solidity ^0.4.11;

contract SimpleMarket {

  struct Secret {

    string title;
    string message;
    uint256 price;
    uint256 rank; // to implement ranking system after
    address owner;

  }

  bytes32[] secretKeys;

  /*
    Store -> key(hash _message) and value(struct Secret)
  */
  mapping(bytes32 => Secret) storedSecrets;

  /*
    Action Events Declaration
  */
  event SecretBoughtEvent(address indexed _buyer, bytes32 _key);
  event SecretAddedEvent(bytes32 key, string title, uint256 price, uint256 rank, address owner);

  function sellSecret(string _title, string _message, uint256 _price) public {
    /*
      create and store secret in contract
    */

    var key = keccak256(_message);
    /* if (storedSecrets[key].owner == address(0x0)) return false; */

    storedSecrets[key] = Secret(_title, _message, _price, 10, msg.sender);
    secretKeys.push(key);

    SecretAddedEvent(key, _title, _price, 10, msg.sender);
  }

  function buySecret(bytes32 _key) public payable {
    /*
      Transfer ownership from seller to buyer
    */
    var secret = storedSecrets[_key];
    require(msg.value >= secret.price);
    require(msg.sender != secret.owner);

    secret.owner.transfer(msg.value);
    secret.owner = msg.sender;

    SecretBoughtEvent(secret.owner, _key);
  }

  function revealSecret(bytes32 _key) public returns(string message, uint256 rank) {
    /*
      if caller is owner of secret, returns message
    */
    require(keyExist(_key));
    var secret = storedSecrets[_key];

    if (secret.owner == msg.sender) {
      secret.rank--;
      return (secret.message, secret.rank);
    }
    return ("This secret isnt yours", 0);
  }

  function getSecretByIndex(uint256 _index) public view returns(bytes32 key, string title, uint256 price, uint256 rank, address owner) {
    /*
      Public getter: returns partial info about the secret indexed
    */
    assert(_index >= 0 && _index < secretKeys.length);

    var _key = secretKeys[_index];
    var secret = storedSecrets[_key];

    /* if (secret.owner == msg.sender) {
      owned = true;
    } */

    return (_key, secret.title, secret.price, secret.rank, secret.owner);
  }

  function getNumberOfSecrets() public view returns(uint256) {
    /*
      Public getter: returns the size of storedSecrets Arr
    */
    return secretKeys.length;
  }

  function keyExist(bytes32 _key) public view returns(bool) {
    /*
      To change to private method -> check if hashed key already exist
    */
    for(uint256 i = 0; i < secretKeys.length; i++){
      if (secretKeys[i] == _key) return true;
    }
    return false;
  }
}