import React, { useEffect, useState } from 'react';
import useApiPrivate from 'hooks/useApiPrivate';
import style from '../style.module.scss';
import { AiOutlineCheck } from 'react-icons/ai';
import { CiTrash } from 'react-icons/ci';
import clsx from 'clsx';
function FriendRequest() {
  const [Requests, setRequests] = useState([]);
  const { apiPrivate } = useApiPrivate();
  useEffect(() => {
    const onGetRequest = async () => {
      try {
        const resp = await apiPrivate({ url: '/friendRequest', options: { params: { p: 1 } } });
        setRequests(resp);
        return resp;
      } catch (error) {
        console.log(error);
      }
    };
    onGetRequest();
  }, []);
  const onAcceptRequest = async (id) => {
    try {
      await apiPrivate({ url: `/acceptRequest`, method: 'POST', data: { id } });
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const onRefuseRequest = async (id) => {
    try {
      await apiPrivate({ method: 'DELETE', url: 'refuseRequest', data: { id: id } });
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {Requests.length > 0 &&
        Requests.map((Request) => (
          <div key={Request._id}>
            <div className="d-flex text-light p-3" style={{ width: 300 }}>
              <div>
                <img className={clsx(style.avatarNotify)} src={Request.users.avatar} alt="" />
              </div>
              <div className="mx-2">
                <h5 className="font-weight-bold d-inline">{Request.users.fullName} </h5>
                <div style={{ fontSize: 15 }} className="text-left d-inline">
                  Đã gửi lời kết bạn cho bạn. Hãy đồng ý để trở thành bạn bè
                </div>
              </div>
              <div>
                <button className="btn btn-success mb-1" onClick={() => onAcceptRequest(Request._id)}>
                  <AiOutlineCheck />
                </button>
                <button className="btn btn-danger" onClick={() => onRefuseRequest(Request._id)}>
                  <CiTrash />
                </button>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}

export default FriendRequest;
