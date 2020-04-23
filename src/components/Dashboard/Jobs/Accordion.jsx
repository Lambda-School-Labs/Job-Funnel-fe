import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import heart from "./../../../images/heartEmpty.svg";
import Modal from "react-modal";

import heartFull from "./../../../images/heartFull.svg";
import {
  updateSaved,
  deleteSaved,
  updateApplied,
  deleteApplied,
} from "../../../redux-store/App/AppActions";
import { Loading } from "./../Loading";
import axiosWithAuth from "./../../../utils/axiosWithAuth";
function Accordion(props) {
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState({});
  const [description, setDescription] = useState({});
  const [loading, setLoading] = useState(false);

  const user_id = props.currentUser.id;
  const job_id = props.id;
  const [toggle, setToggle] = useState(false);
  const [apply, setApply] = useState(false);
  const [modal, setModal] = useState(false);

  const ModalStyle = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      transition: "ease-in-out",
    },
    content: {
      backgroundColor: "white",
      top: "20%",
      marginBottom: "50px",
      maxHeight: "100vh",
      /* 			overflowY: 'auto',
       */ left: "30%",
      right: "30%",
      width: "40vw",
      height: "40vh",
    },
  };

  //state for saved status
  const [saved, setSaved] = useState({
    user_id: user_id,
    job_id: job_id,
    status: "saved",
  });

  //state for applied status
  const [applied, setApplied] = useState({
    user_id: user_id,
    job_id: job_id,
    status: "applied",
  });

  //check to see if saved

  useEffect(() => {
    axiosWithAuth()
      .get(`/saved/${user_id}`)
      .then((res) => {
        let checkSaved = res.data.filter(
          (e) => e.status === "saved" && e.job_id === job_id
        );
        checkSaved.length > 0 && checkSaved
          ? setToggle(true)
          : setToggle(false);
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, [props.savedArray]);

  useEffect(() => {
    setLoading(true);
    axiosWithAuth()
      .get(`/jobs/${job_id}`)
      .then((response) => {
        setDetails(response.data);
        setDescription(response.data.description);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, [job_id]);

  //handles save, sends the saved jobs to the saved endpoint.
  const handleSave = () => {
    if (toggle === false) {
      props.updateSaved(saved);
      setToggle(true);

      //Delete save
    } else if (toggle === true) {
      props.deleteSaved(job_id);
      setToggle(false);
    }
  };

  const handleApply = () => {
    setModal(false);
    console.log("toggle is", toggle);
    if (apply === false) {
      props.updateApplied(applied);
      setApply(true);

      //Delete save
    } else if (apply === true) {
      props.deleteApplied(job_id);
      setApply(false);
    }
  };

  const onClick = () => {
    setOpen(!open);
  };

  //Gives the posted date
  let date = new Date(details.post_date_utc);

  let dateMonth = date.getUTCMonth() + 1;
  let dateDay = date.getDate();
  let dateYear = date.getFullYear();

  if (loading === true) {
    return null;
  }

  if (modal === true) {
    return (
      <Modal
        className="modal"
        isOpen={modal}
        onRequestClose={() => setModal(false)}
        style={ModalStyle}
      >
        <div class="close">
          <button onClick={() => setModal(false)}>X</button>
        </div>
        <div className="modal-content">
          <h2>
            Did you apply to the job of <span>{props.title}</span> at{" "}
            {props.company}?
          </h2>
          <div className="modal-buttons">
            <button onClick={handleApply}>Yes</button>
            <button onClick={() => setModal(false)}>No</button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <>
      <div className={open ? "accordion-item--opened" : "accordion-item"}>
        <div className="accordion-item__line">
          <div className="accordion-header">
            <p className="accordion-item__title">{props.company}</p>

            {toggle === false ? (
              <button onClick={handleSave}>
                <img src={heart} />{" "}
              </button>
            ) : (
              <button onClick={handleSave}>
                <img src={heartFull} />
              </button>
            )}
          </div>

          <div className="card-text">
            <div className="card-info">
              <h3>{props.title}</h3>
            </div>
          </div>

          <div className="jobButtons">
            {apply === false ? (
              <a
                className="more openModal"
                href={details.testexternal_url}
                target="_blank"
                onClick={() => setModal(true)}
              >
                Apply
              </a>
            ) : (
              <a
                className="more openModal"
                href={details.testexternal_url}
                target="_blank"
              >
                Applied
              </a>
            )}
          </div>
          <div className="icon-more">
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAQAAABIkb+zAAABGklEQVR4Ae3RAcZCQRiF4buDfwshBGi+2UQgcIGAVtpSIuS/KyilG+UTcbk6zIH3GQBm3mM6AAAAAAAAAACA+eqf/yZBXcV/2XeCVPYx1FXj/FjGUMd45AQp/1HHGGLZNL+e61jHnKDmv8652YT1IvPfE2LX/Sh27/ycsF60yT/lk58JYn6eU4MJccjnlAmZ/33i0OAH4jg9Qcw/5g9YJpS+m6n0xvzpCfVe+nn59S7kGyYo+YYJWz3fO+E2PaFs9XzPhMy/6fmWCXq+YUJs9HzrhLh+JsQmrnq+bYKeb52g53snXPR88wQ93z9Bz/dP0PP9E/R89wQ93zpBz7dO0POtE/R86wQ93zpBzzdP+MoHAAAAAAAAAADAExTnTW20AtjhAAAAAElFTkSuQmCC"
              align="center"
              onClick={onClick}
              className="accordion-item__icon"
            />
          </div>
        </div>

        <div className="accordion-item__inner">
          <div className="accordion-item__content">
            <p className="accordion-item__paragraph">{details.city}</p>
            <p className="accordion-item__paragraph">
              {details.stateOrProvince}
            </p>
            <p>
              {dateMonth}-{dateDay}-{dateYear}
            </p>
            <a className="job-listing-link" href={details.testexternal_url}>
              Link to Application
            </a>
            <p>{details.description}</p>
          </div>
        </div>
      </div>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.AppReducer.currentUser,
    savedArray: state.AppReducer.saved,
  };
};

export default connect(mapStateToProps, {
  updateSaved,
  deleteSaved,
  updateApplied,
  deleteApplied,
})(Accordion);
