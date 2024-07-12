import { Server as SocketIOServer } from 'socket.io';
import { Server } from 'http';

const initializeSocket = (server: Server, origins: string[]): SocketIOServer => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: origins,
      credentials: true,
    },
  });

  io.on('connection', socket => {
    socket.on('saveInOrderSuccess', () => {
      socket.broadcast.emit('receiveSaveInOrderSuccess', 'Có lệnh mới được tạo thành công');
    });

    socket.on('completeJobQuantityCheck', () => {
      socket.broadcast.emit('receiveCompleteJobQuantityCheck', 'Có pallet mới hoàn thành kiểm đếm');
    });
  });

  return io;
};

export default initializeSocket;
