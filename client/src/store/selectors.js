export const authSelector = (state) => state.isAuth;
export const notifySelector = (state) => state.notify;
export const settingSelector = (state) => state.setting;
export const RequestSelector = (state) => state.Request;
export const friendSelector = (state) => state.contacts.friends;
// export const recentContact = (state) => state.contacts.friends;

export const groupsSelector = (state) => state.contacts.groups;
export const contactsSelector = (state) => state.contacts.recent;

export const friendRemainingSelector = (state) => {
  const friends = state.contacts.friends;
  if (state.contacts.filter === '') {
    return friends;
  }
  return friends.filter((friend) => {
    if (friend.fullName.includes(state.contacts.filter)) {
      return friend;
    }
  });
};

export const peerSelector = (state) => state.peer;

export const contactSearchSelector = (state) => {
  const recent = state.contacts.recent;
  if (state.contacts.sidebarFilter === '') {
    return recent;
  }
  return recent.filter((item) => {
    if (item.contact.fullName) {
      if (item.contact.fullName.includes(state.contacts.sidebarFilter)) return item;
    } else if (item.contact.name) {
      if (item.contact.name.includes(state.contacts.sidebarFilter)) return item;
    } else if (item.name.includes(state.contacts.sidebarFilter)) return item;
  });
};
