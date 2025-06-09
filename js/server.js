const socket = io("http://172.232.41.124:3000");
const params = new URLSearchParams(window.location.search);

socket.on('connect', () => {
  socket.emit('playerConnected', { roomId : params.has('room') ? params.get('room') : null });
});

socket.on('waiting', () => {
  document.getElementById('status').innerText = 'En attente d\'un adversaire';
});

socket.on('startGame', ({ room, player }) => {
  document.getElementById('status').innerText = `Jeu démarré dans la room "${room}" en tant que Joueur ${player}`;
});