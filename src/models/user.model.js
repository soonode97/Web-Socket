/** 소켓에 연결된 유저들의 데이터를 관리하는 곳이다.
 * 보통 DB에 저장되어 있다면 등록된 아이디(UUID)인지 조회해서 없는 경우 새로 발급을 해주는 형태로 하지만
 * 지금은 서버 메모리에서 저장할 예정이기 때문에 아래 내용처럼 구현
 */

// 유저 데이터를 저장할 메모리
const users = [];

export const addUser = (user) => {
  users.push(user);
};

export const getUser = () => {
  return JSON.stringify(users);
};

export const removeUser = (socketId) => {
  const index = users.findIndex((user) => user.socketId === socketId);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};
