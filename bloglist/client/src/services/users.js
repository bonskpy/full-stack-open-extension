const getAllUsers = async () => {
  const response = await fetch("/api/users");
  if (!response.ok) {
    throw Error("unable to fetch users");
  }
  const users = await response.json();
  return users;
};

export default getAllUsers;
