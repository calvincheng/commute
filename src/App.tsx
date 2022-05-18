/** @jsxImportSource @emotion/react */
import { useState } from "react";
import { useCopyToClipboard } from "react-use";
import { css } from "@emotion/react";

const STOPS = [
  { name: "Admiralty" },
  { name: "Exhibition Center" },
  { name: "Hung Hom" },
  { name: "Mong Kok East" },
  { name: "Kowloon Tong" },
  { name: "Tai Wai" },
  { name: "Sha Tin" },
  { name: "Fo Tan" },
  { name: "University" },
  { name: "Science Park" },
];

const Link = ({ color = "#80C1EB" }) => {
  return (
    <div
      css={css`
        width: 32px;
        height: 40px;
        background: ${color};
      `}
    />
  );
};

const Button = ({ children, onClick, disabled = false }: any) => {
  return (
    <div
      css={css`
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: ${!disabled ? "pointer" : "auto"};
        height: 100%;
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

const Stop = ({ show, name, time = null, onClick }: any) => {
  return (
    <div
      css={css`
        visibility: ${show ? "visible" : "hidden"};
        pointer-events: ${show ? "auto" : "none"};
        display: flex;
        align-items: center;
        gap: 16px;
      `}
    >
      <div
        css={css`
          width: 120px;
          text-align: right;
        `}
      >
        <b>{name}</b>
      </div>
      <div
        css={css`
          width: 160px;
          height: 40px;
          border-radius: 20px;
          border: 2px solid black;
          font-weight: 600;
        `}
      >
        <Button onClick={onClick}>
          {time ? new Date(time).toLocaleTimeString() : "LOG TIME"}
        </Button>
      </div>
    </div>
  );
};

function App() {
  const [name, setName] = useState("");
  const [times, setTimes] = useState(new Array(STOPS.length).fill(null));
  const [stop, setStop] = useState(0);
  const [toHKSTP, setToHKSTP] = useState(true);
  const [_, copyToClipboard] = useCopyToClipboard();

  return (
    <div
      css={css`
        margin-top: 16px;
        display: flex;
        align-items: center;
        flex-direction: column;
        gap: 16px;
      `}
    >
      <div>
        <input
          value={name}
          placeholder="Name"
          css={css`
            width: 160px;
            padding: 8px 8px;
            margin-bottom: 12px;
          `}
          onChange={(event) => setName(event.target.value)}
        />
      </div>
      {STOPS.map(({ name }, index) => {
        return (
          <Stop
            name={name}
            show={index <= stop}
            time={times[index]}
            onClick={() => {
              if (times[index] !== null) return;
              setTimes((cur) => {
                const newTimes = [...cur];
                newTimes[index] = Date.now();
                return newTimes;
              });
              setStop((stop) => stop + 1);
            }}
          />
        );
      })}
      {stop >= STOPS.length && (
        <div
          css={css`
            margin-top: 12px;
            display: flex;
            align-items: center;
            gap: 4px;
          `}
        >
          <div
            css={css`
              text-align: right;
              width: 120px;
            `}
          >
            <b>COPY RESULTS</b>
          </div>
          <div
            css={css`
              width: 8px;
            `}
          />
          <div
            css={css`
              padding: 8px 16px;
              background: #00000011;
              border-radius: 8px;
            `}
          >
            <Button
              onClick={() => {
                const cells = [
                  new Date().toLocaleDateString(),
                  name || "Anonymous",
                  ...times.map((t) => new Date(t).toLocaleTimeString()),
                ];
                const toCopy = `=SPLIT("${cells.join(",")}", ",")`;
                copyToClipboard(toCopy);
              }}
            >
              SHEETS
            </Button>
          </div>
          <div
            css={css`
              padding: 8px 16px;
              background: #00000011;
              border-radius: 8px;
            `}
          >
            <Button
              onClick={() => {
                const json = {
                  date: new Date().toLocaleDateString(),
                  name: name || "Anonymous",
                  toHKSTP: true,
                  times,
                };
                const toCopy = JSON.stringify(json, null, 4);
                copyToClipboard(toCopy);
              }}
            >
              JSON
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;