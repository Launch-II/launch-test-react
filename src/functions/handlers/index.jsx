const TestCommand = ({ data, siblingFunctions }) => {
  console.log('received command:', data.name);
};
const AuthorizationSuccess = ({ data, siblingFunctions }) => {
  console.log('Received Authorization Success!', { data });
  siblingFunctions.callCommsFunction(`setUser`, data.data);
};
const PlayerCreateSuccess = ({ data, siblingFunctions }) => {
  console.log('Player Creation Success', { data });
  siblingFunctions.callCommsFunction(`setPlayer`, data.data);
};
export default {
  TestCommand,
  AuthorizationSuccess,
  PlayerCreateSuccess,
};
