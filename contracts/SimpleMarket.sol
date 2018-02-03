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
  uint256 secretCount;

  /*
    Store -> key(hash _message) and value(struct Secret)
  */
  mapping(bytes32 => Secret) storedSecrets;

  function sellSecret(string _title, string _message, uint256 _price) public returns(bytes32) {
    /*
      create and store secret in contract
    */

    var secretKey = hashSecret(_message);
    /* if (storedSecrets[secretKey].owner == address(0x0)) return false; */

    storedSecrets[secretKey] = Secret(_title, _message, _price, 10, msg.sender);
    secretKeys.push(secretKey);
    secretCount++;

    return (secretKey);
  }

  function buyArticle(bytes32 _secretKey) payable public returns(string) {
    /* To continue implementation | need to remove from array | add transaction transfer */

    var secret = storedSecrets[_secretKey];

    secret.owner = msg.sender;
    secret.rank--;

    return (secret.title);
  }

  function revealSecret(bytes32 _secretKey) public view returns(string message) {
    /*
      if caller is owner of secret, returns message
    */
    assert(keyExist(_secretKey));

    var callerAddress = msg.sender;
    var secret = storedSecrets[_secretKey];

    if (secret.owner == callerAddress) return (secret.message);
    return ("This secret isnt yours");
  }

  function getSecretByIndex(uint256 _index) public view returns(bytes32 key, string title, uint256 price) {
    /*
      Public getter: returns partial info about the secret indexed
    */
    var _key = secretKeys[_index];
    var secretToReturn = storedSecrets[_key];

    return (_key, secretToReturn.title, secretToReturn.price);
  }

  function getNumberOfSecrets() public view returns(uint256) {
    /*
      Public getter: returns the size of storedSecrets Arr
    */
    return secretCount;
  }

  function hashSecret(string _message) public pure returns(bytes32) {
    /*
      Hash the message to serve as key for storedSecrets
    */
    return keccak256(_message);
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