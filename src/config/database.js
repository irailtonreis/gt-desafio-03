module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'docker',
  database: 'gobarber-desafio',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
