var randomNumber = 0

module.exports = {
  getRandomNumber: function (minNum, maxNum) {
    randomNumber = Math.floor(Math.random() * maxNum)

    while (randomNumber < minNum) {
      randomNumber = Math.floor(Math.random() * maxNum)
    }
    return randomNumber
  },

  getRandomActivity: function (client) {
    const stats = [];
    stats[0] = ` ${client.guilds.cache.size}`;
    stats[1] = ` ${client.users.cache.size}`;
    stats[2] = ` ${client.channels.cache.size}`;

    var random = module.exports.getRandomNumber(0,5);

    switch(random) {
      case 1:
          client.user.setActivity(`${stats[0]} Guilds`, { type: 'LISTENING' });
          random = module.exports.getRandomNumber(0,5);
          break;
      case 2:
          client.user.setActivity(`${stats[1]} Members`, { type: 'LISTENING' });
          random = module.exports.getRandomNumber(0,5);
          break;
      case 3:
          client.user.setActivity(`${stats[2]} Channels`, { type: 'LISTENING' });
          random = module.exports.getRandomNumber(0,5);
          break;
      case 4:
          client.user.setActivity(`with @Spastencord#1289`, { type: 'Competing' });
          random = module.exports.getRandomNumber(0,5);
          break;
      default:
          client.user.setActivity(`@Botis‽#6940`, { type: 'WATCHING' });
          random = module.exports.getRandomNumber(0,5);
          break;
  }
  }
}
