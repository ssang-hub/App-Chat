import React from 'react';

import { AiOutlineUserAdd, AiOutlineUsergroupAdd } from 'react-icons/ai';
import { changeSidebarFilter } from 'store/reducers/contacts.slice';
import {useDispatch} from "react-redux";
function Header() {
    const dispatch = useDispatch();
  return (
    <div className="headerSidebar d-flex mt-3 ml-3">
      <div className="input-group mb-3 ">
        <input type="text" className="form-control" placeholder="Tìm kiếm bạn bè" aria-describedby="basic-addon2" onChange={(e) => dispatch(changeSidebarFilter(e.target.value))} />
      </div>
      <div className="text-light btn btn-outline-secondary font-size-18 h-50 mx-1 border-0" data-bs-toggle="modal" data-bs-target="#addFriendContainer">
        <AiOutlineUserAdd />
      </div>
      <div className="text-light btn btn-outline-secondary font-size-18 h-50 mx-1 border-0" data-bs-toggle="modal" data-bs-target="#addGroupContainer">
        <AiOutlineUsergroupAdd />
      </div>
    </div>
  );
}

export default Header;
