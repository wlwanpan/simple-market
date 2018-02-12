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
  event SecretBought(bytes32 key, uint256 rank, address owner);
  event SecretAdded(bytes32 key, string title, uint256 price, uint256 rank, address owner);

  function sellSecret(string _title, string _message, uint256 _price) public {
    /*
      create and store secret in contract
    */

    var key = keccak256(_message);
    /* if (storedSecrets[key].owner == address(0x0)) return false; */

    storedSecrets[key] = Secret(_title, _message, _price, 10, msg.sender);
    secretKeys.push(key);

    SecretAdded(key, _title, _price, 10, msg.sender);
  }

  function buySecret(bytes32 _key) public payable {
    /*
      Transfer ownership from seller to buyer
    */
    var secret = storedSecrets[_key];
    require(msg.value >= secret.price);

    /* send returns a bool after transaction state | transfer raise error -> check best practice/ error handling */
    if (secret.owner.send(msg.value)) {
      secret.owner = msg.sender;
      secret.rank--;
      SecretBought(_key, secret.rank, secret.owner);
    }
  }

  function revealSecret(bytes32 _key) public view returns(string message) {
    /*
      if caller is owner of secret, returns message
    */
    require(keyExist(_key));
    var secret = storedSecrets[_key];

    if (secret.owner == msg.sender) return (secret.message);
    return ("This secret isnt yours");
  }

  function getSecretByIndex(uint256 _index) public view returns(bytes32 key, string title, uint256 price, uint256 rank, bool owned) {
    /*
      Public getter: returns partial info about the secret indexed
    */
    assert(_index >= 0 && _index < secretKeys.length);

    var _key = secretKeys[_index];
    var secretToReturn = storedSecrets[_key];

    if (secretToReturn.owner == msg.sender) {
      owned = true;
    }

    return (_key, secretToReturn.title, secretToReturn.price, secretToReturn.rank, owned);
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