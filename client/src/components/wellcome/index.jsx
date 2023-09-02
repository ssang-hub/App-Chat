import React from 'react';
/**
 * @return {JSX.Element}
 * */
function WellCome() {
  return (
    <div className="w-75  align-items-center d-flex flex-column m-auto">
      <div>
        <div className="text-light">
          <div className="d-inline">Chào mừng bạn đến với </div>
          <h3 className="d-inline">AppChat Nodejs</h3>
          <div>Khám phá những tiện ích hỗ trợ làm việc và trò chuyện cùng người thân, bạn bè được tối ưu hoá cho máy tính của bạn.</div>
        </div>
      </div>
      <div className="d-flex justify-content-center">
        <div id="carouselExampleFade" className="carousel slide carousel-fade slider" data-bs-ride="carousel">
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src="./No data-cuate.svg" className="d-block w-100" alt="..." style={{ height: 550 }} />
              <h5 className="text-primary">Cho phép bạn gửi file một cách thuận tiện</h5>
              <div className="text-light">Gửi file? AppChat lo hết!</div>
            </div>
            <div className="carousel-item">
              <img src="./Pitch meeting-amico.svg" className="d-block w-100" alt="..." />
              <h5 className="text-primary">Giải quết công việc một cách hiệu quả</h5>
              <div className="text-light">Giúp bạn kết nối với đồng nghiệp, gia đình, bạn bè một cách nhanh chóng</div>
            </div>
            <div className="carousel-item">
              <img src="./400 Error Bad Request-rafiki.svg" className="d-block w-100" alt="..." />
              <h5 className="text-primary">Hoạt động ổn định</h5>
              <div className="text-light">Cam kết hoạt dộng ổn định, khắc phục lỗi nhanh chóng</div>
            </div>
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="prev" style={{ left: 450 }}>
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
}

export default WellCome;
