import React, { useState, useEffect } from "react";
import "./EventDisplay.css";
import { get, post } from "../../utilities";

const RankElement = (props) => {
  const [number, setNumber] = useState(1);

  const loadNumber = () => {
    if (props.number !== undefined) {
      setNumber(props.number + 1);
    }
  };

  //   const changeOrder = (e) => {
  //     var id = $(element).attr("id");
  //     id = parseFloat(id.substring(2, id.length)); // remove the "el"
  //     var idDisp = parseFloat(ranksIds[idsRanks[id] - dir]);
  //     distance = distance * dir;

  //     // if we're not trying to move it too high/low
  //     if ((idsRanks[id] < ranksIds.length - 1 && dir == -1) || (idsRanks[id] > 0 && dir == 1)) {
  //       // move the clicked one down in the variables
  //       idsRanks[id] = idsRanks[id] - dir;
  //       ranksIds[idsRanks[id]] = id;
  //       idsPoss[id] = idsPoss[id] - distance;

  //       // move the displaced one up in the variables
  //       idsRanks[idDisp] = idsRanks[id] + dir;
  //       ranksIds[idsRanks[id] + dir] = idDisp;
  //       idsPoss[idDisp] = idsPoss[idDisp] + distance;

  //       // change the form input values
  //       $("input[name='" + id + "']").attr("value", idsRanks[id]);
  //       $("input[name='" + idDisp + "']").attr("value", idsRanks[idDisp]);

  //       // change the rank display number
  //       $("font.rankDisp#el" + id).html(idsRanks[id] + 1);
  //       $("font.rankDisp#el" + idDisp).html(idsRanks[idDisp] + 1);

  //       // move them physically
  //       $(".rankElement#el" + id).animate({ top: idsPoss[id] + "px" }, speed);
  //       $(".rankElement#el" + idDisp).animate({ top: idsPoss[idDisp] + "px" }, speed);
  //     }
  //   };

  useEffect(() => {
    loadNumber();
  }, [props]);

  return (
    <div className={"rankElement el" + (number - 1).toString()}>
      <input type="hidden" name={number} />
      <font className="rankDisp" id="el0">
        {number}
      </font>
      &nbsp;&nbsp;&nbsp; {props.name}
      <b className={"down" + (number - 1).toString()}>&nbsp;∨</b>
      <b className={"up" + (number - 1).toString()}>∧&nbsp;</b>
    </div>
  );
};

export default RankElement;
