import React, { useState, useEffect } from "react";
import Divider from "@mui/material/Divider";

export default function TemporaryDrawer(props) {
  const [playerNews, setPlayerNews] = useState([]);
  useEffect(() => {
    fetch(
      "https://www.nbcsportsedge.com/api/player_news?page%5Blimit%5D=10&sort=-initial_published_date&include=team,league,league.sport&filter%5Bsport_headline%5D=1&filter%5Bleague.meta.drupal_internal__id%5D=11"
    )
      .then((res) => res.json())
      .then((data) => {
        // console.log("data", data.data);
        // console.log("- type - ", data.data[0].type);
        // console.log("- attributes - ", data.data[0].attributes.created);
        // console.log("- attributes - ", new Date(data.data[0].attributes.changed).toLocaleDateString());
        // console.log("- attributes - ", new Date(data.data[0].attributes.changed).toLocaleTimeString());
        // console.log(
        //   "- attributes.headline - ",
        //   data.data[0].attributes.headline
        // );
        // console.log(
        //   "- attributes.analysis - ",
        //   data.data[0].attributes.analysis
        // );
        // console.log(
        //   "- attributes.analysis.value - ",
        //   data.data[0].attributes.analysis.value
        // );
        // console.log("- attributes.injury - ", data.data[0].attributes.injury);
        setPlayerNews(data.data);
      });
  }, []);
  console.log("playerNews[0]", playerNews[0]);
  return (
    <div style={{ padding: "12px" }}>
      {playerNews.length === 0 ? (
        <p>no news</p>
      ) : (
        playerNews.map((playerNews) => {
          //           const markup = { __html: '<p>some raw html</p>' };
          // return <div dangerouslySetInnerHTML={markup} />;
          return (
            <div
              style={{
                marginBottom: "24px",
                // width: "80%",
                // overflowWrap: "break-word",
                // wordWrap: "break-word",
                // wordBreak: "break-word",
              }}
            >
              {/* new Date(data.data[0].attributes.changed).toLocaleDateString() */}
              <h5 style={{ whiteSpace: "break-spaces", marginBottom: "4px" }}>
                {`${new Date(
                  playerNews.attributes.changed
                ).toLocaleDateString()} at ${new Date(
                  playerNews.attributes.changed
                ).toLocaleTimeString()}`}
              </h5>
              <h4 style={{ whiteSpace: "break-spaces", marginBottom: "12px" }}>
                {playerNews.attributes.headline}
              </h4>

              <Divider />
              <div
                style={{ whiteSpace: "break-spaces", marginBottom: "12px" }}
                dangerouslySetInnerHTML={{
                  __html: playerNews.attributes.analysis.value,
                }}
              />
            </div>
          );
          // <div style={{marginBottom:'14px'}}key={playerNews.id}>
          // {/* <p></p> */}
        })
      )}
    </div>
  );
}
