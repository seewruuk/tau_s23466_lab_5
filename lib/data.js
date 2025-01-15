let users = [
    {id: 0, name: "Jan Kowalski", email: "jan@kowalski.pl"},
    {id: 1, name: "Anna Nowak", email: "anna@nowak.pl"},
]

export const getUsers = () => users;

export const getUserById = (id) => users.find((user) => user.id === id);

export const addUser = (user) => {
    const newUser = {
        id: users.length,
        ...user,
    }
    users.push(newUser);
    return newUser;
}

export const updateUser = (id, user) => {
    const index = users.findIndex(user => user.id === id );
    console.log("index", index)
    if (index === -1) {
        return null;
    }
    users[index] = {id, ...user};
    return users[index];
}

export const deleteUser = (id) => {
    const findUser = users.find((u) => u.id === id)
    if (!findUser) {
        return null
    }
    return users = users.filter((u) => u.id !== id)
}

