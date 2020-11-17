import React from "react";
import { withRouter } from "react-router-dom";
import gsap from "gsap";

class Home extends React.Component {
  componentDidMount() {
    let tl = gsap.timeline();
    tl.set(".animator", {
      opacity: 0,
      y: 50
    });
    tl.to(".animator", {
      duration: 0.6,
      opacity: 1,
      y: 0,
      stagger: 0.07
    });

    tl.to(
      "#logo",
      {
        strokeDashoffset: 0,
        duration: 2
      },
      "-=0.6"
    );

    tl.to("#logo", {
      fill: "#3D82AC",
      duration: 0.5
    });
  }
  render() {
    return (
      <div className="container-fluid">
        <div className="row homeOne position-fixed">
          <svg
            className="homeSplash animator"
            width="552.661"
            height="86.798"
            viewBox="0 0 552.661 86.798"
          >
            <defs>
              <linearGradient
                id="linear-gradient"
                x1="0.24"
                y1="1.915"
                x2="0.839"
                y2="-2.286"
                gradientUnits="objectBoundingBox"
              >
                <stop offset="0" stop-color="#3d82ac" />
                <stop offset="1" stop-color="#b343bf" />
              </linearGradient>
            </defs>
            <g id="Splash_Logo" transform="translate(-683.88 -513.418)">
              <path
                id="tag"
                className="cls-1"
                d="M4.1-10.224H.072V-12.6h10.98v2.376H7.02V0H4.1ZM14.886-8.406a3.123,3.123,0,0,1,1.359-1.062,5.044,5.044,0,0,1,1.971-.36v2.592q-.468-.036-.63-.036A2.574,2.574,0,0,0,15.7-6.6a2.728,2.728,0,0,0-.684,2.025V0H12.2V-9.684h2.682Zm8.856-1.422A5.04,5.04,0,0,1,27.2-8.757,4.1,4.1,0,0,1,28.4-5.526V0H25.776V-1.206A3.129,3.129,0,0,1,22.824.144a4.582,4.582,0,0,1-1.935-.378,2.885,2.885,0,0,1-1.251-1.044,2.717,2.717,0,0,1-.432-1.512,2.523,2.523,0,0,1,1.017-2.124,5.183,5.183,0,0,1,3.141-.774H25.6A1.79,1.79,0,0,0,25.038-7.1,2.458,2.458,0,0,0,23.364-7.6a4.888,4.888,0,0,0-1.521.243,4.024,4.024,0,0,0-1.269.657L19.566-8.658a6.082,6.082,0,0,1,1.9-.864A8.507,8.507,0,0,1,23.742-9.828Zm-.216,8.082A2.445,2.445,0,0,0,24.8-2.079,1.822,1.822,0,0,0,25.6-3.06v-.99H23.67q-1.728,0-1.728,1.134a1.01,1.01,0,0,0,.423.855A1.905,1.905,0,0,0,23.526-1.746Zm17.388-11.61V0H38.232V-1.116A3.7,3.7,0,0,1,35.208.144a5.029,5.029,0,0,1-2.475-.612A4.382,4.382,0,0,1,31-2.214a5.322,5.322,0,0,1-.63-2.628A5.322,5.322,0,0,1,31-7.47a4.382,4.382,0,0,1,1.737-1.746,5.029,5.029,0,0,1,2.475-.612,3.684,3.684,0,0,1,2.9,1.17v-4.7Zm-5.22,11.2a2.346,2.346,0,0,0,1.764-.729,2.7,2.7,0,0,0,.7-1.953,2.7,2.7,0,0,0-.7-1.953,2.346,2.346,0,0,0-1.764-.729,2.368,2.368,0,0,0-1.782.729,2.7,2.7,0,0,0-.7,1.953,2.7,2.7,0,0,0,.7,1.953A2.368,2.368,0,0,0,35.694-2.16Zm17.3-2.646q0,.054-.054.756H45.612a2.282,2.282,0,0,0,.936,1.422,3.1,3.1,0,0,0,1.836.522,3.718,3.718,0,0,0,1.341-.225,3.248,3.248,0,0,0,1.089-.711l1.494,1.62a5.021,5.021,0,0,1-4,1.566,6.321,6.321,0,0,1-2.9-.639A4.684,4.684,0,0,1,43.47-2.268a4.885,4.885,0,0,1-.684-2.574,4.949,4.949,0,0,1,.675-2.565,4.729,4.729,0,0,1,1.854-1.782,5.444,5.444,0,0,1,2.637-.639,5.4,5.4,0,0,1,2.574.612,4.467,4.467,0,0,1,1.809,1.755A5.233,5.233,0,0,1,52.992-4.806ZM47.97-7.7a2.418,2.418,0,0,0-1.6.54,2.3,2.3,0,0,0-.792,1.476h4.77a2.322,2.322,0,0,0-.792-1.467A2.367,2.367,0,0,0,47.97-7.7ZM55.926.144a1.688,1.688,0,0,1-1.242-.5,1.71,1.71,0,0,1-.5-1.26,1.643,1.643,0,0,1,.5-1.251,1.738,1.738,0,0,1,1.242-.477,1.738,1.738,0,0,1,1.242.477,1.643,1.643,0,0,1,.5,1.251,1.71,1.71,0,0,1-.5,1.26A1.688,1.688,0,0,1,55.926.144ZM70.9.216a7.237,7.237,0,0,1-3.483-.837,6.247,6.247,0,0,1-2.448-2.322A6.4,6.4,0,0,1,64.08-6.3a6.4,6.4,0,0,1,.891-3.357,6.247,6.247,0,0,1,2.448-2.322,7.275,7.275,0,0,1,3.5-.837,7.343,7.343,0,0,1,2.961.576A5.931,5.931,0,0,1,76.1-10.584L74.232-8.856a4.025,4.025,0,0,0-3.168-1.476,4.207,4.207,0,0,0-2.088.513,3.647,3.647,0,0,0-1.431,1.431A4.207,4.207,0,0,0,67.032-6.3a4.207,4.207,0,0,0,.513,2.088,3.647,3.647,0,0,0,1.431,1.431,4.207,4.207,0,0,0,2.088.513,4.006,4.006,0,0,0,3.168-1.494L76.1-2.034A5.835,5.835,0,0,1,73.872-.36,7.408,7.408,0,0,1,70.9.216ZM82.134.144A5.807,5.807,0,0,1,79.389-.5a4.75,4.75,0,0,1-1.9-1.773,4.885,4.885,0,0,1-.684-2.574,4.885,4.885,0,0,1,.684-2.574,4.75,4.75,0,0,1,1.9-1.773,5.807,5.807,0,0,1,2.745-.639,5.753,5.753,0,0,1,2.736.639,4.765,4.765,0,0,1,1.89,1.773,4.885,4.885,0,0,1,.684,2.574,4.885,4.885,0,0,1-.684,2.574A4.765,4.765,0,0,1,84.87-.5,5.753,5.753,0,0,1,82.134.144Zm0-2.3a2.339,2.339,0,0,0,1.773-.729A2.717,2.717,0,0,0,84.6-4.842,2.717,2.717,0,0,0,83.907-6.8a2.339,2.339,0,0,0-1.773-.729,2.368,2.368,0,0,0-1.782.729,2.7,2.7,0,0,0-.7,1.953,2.7,2.7,0,0,0,.7,1.953A2.368,2.368,0,0,0,82.134-2.16Zm7.182-11.2h2.808V0H89.316Zm5.418,0h2.808V0H94.734Zm14.9,8.55q0,.054-.054.756h-7.326a2.282,2.282,0,0,0,.936,1.422,3.1,3.1,0,0,0,1.836.522,3.718,3.718,0,0,0,1.341-.225,3.248,3.248,0,0,0,1.089-.711l1.494,1.62a5.021,5.021,0,0,1-4,1.566,6.321,6.321,0,0,1-2.9-.639,4.684,4.684,0,0,1-1.944-1.773,4.885,4.885,0,0,1-.684-2.574,4.949,4.949,0,0,1,.675-2.565,4.729,4.729,0,0,1,1.854-1.782,5.443,5.443,0,0,1,2.637-.639,5.4,5.4,0,0,1,2.574.612,4.467,4.467,0,0,1,1.809,1.755A5.233,5.233,0,0,1,109.638-4.806Zm-5.022-2.9a2.418,2.418,0,0,0-1.6.54,2.3,2.3,0,0,0-.792,1.476h4.77a2.322,2.322,0,0,0-.792-1.467A2.367,2.367,0,0,0,104.616-7.7ZM116.19.144A5.954,5.954,0,0,1,113.409-.5a4.785,4.785,0,0,1-1.926-1.773,4.837,4.837,0,0,1-.693-2.574,4.837,4.837,0,0,1,.693-2.574,4.785,4.785,0,0,1,1.926-1.773,5.954,5.954,0,0,1,2.781-.639,5.388,5.388,0,0,1,2.673.639,3.79,3.79,0,0,1,1.665,1.827l-2.178,1.17a2.381,2.381,0,0,0-2.178-1.332,2.464,2.464,0,0,0-1.818.72,2.651,2.651,0,0,0-.72,1.962,2.651,2.651,0,0,0,.72,1.962,2.464,2.464,0,0,0,1.818.72,2.356,2.356,0,0,0,2.178-1.332L120.528-2.3a3.866,3.866,0,0,1-1.665,1.8A5.328,5.328,0,0,1,116.19.144Zm12.348-.612a2.886,2.886,0,0,1-1.017.459,5.142,5.142,0,0,1-1.269.153,3.77,3.77,0,0,1-2.673-.882,3.375,3.375,0,0,1-.945-2.592V-7.308H121.14v-2.16h1.494v-2.358h2.808v2.358h2.412v2.16h-2.412v3.942a1.322,1.322,0,0,0,.315.945,1.167,1.167,0,0,0,.891.333,1.8,1.8,0,0,0,1.134-.36Zm2.826.612a1.688,1.688,0,0,1-1.242-.5,1.71,1.71,0,0,1-.5-1.26,1.643,1.643,0,0,1,.5-1.251,1.738,1.738,0,0,1,1.242-.477,1.738,1.738,0,0,1,1.242.477,1.643,1.643,0,0,1,.5,1.251,1.71,1.71,0,0,1-.5,1.26A1.688,1.688,0,0,1,131.364.144ZM146.34.216a7.237,7.237,0,0,1-3.483-.837,6.246,6.246,0,0,1-2.448-2.322,6.4,6.4,0,0,1-.891-3.357,6.4,6.4,0,0,1,.891-3.357,6.246,6.246,0,0,1,2.448-2.322,7.275,7.275,0,0,1,3.5-.837,7.343,7.343,0,0,1,2.961.576,5.931,5.931,0,0,1,2.223,1.656L149.67-8.856a4.025,4.025,0,0,0-3.168-1.476,4.207,4.207,0,0,0-2.088.513,3.647,3.647,0,0,0-1.431,1.431A4.207,4.207,0,0,0,142.47-6.3a4.207,4.207,0,0,0,.513,2.088,3.647,3.647,0,0,0,1.431,1.431,4.207,4.207,0,0,0,2.088.513,4.006,4.006,0,0,0,3.168-1.494l1.872,1.728A5.835,5.835,0,0,1,149.31-.36,7.408,7.408,0,0,1,146.34.216ZM157.572.144A5.807,5.807,0,0,1,154.827-.5a4.75,4.75,0,0,1-1.9-1.773,4.885,4.885,0,0,1-.684-2.574,4.885,4.885,0,0,1,.684-2.574,4.75,4.75,0,0,1,1.9-1.773,5.807,5.807,0,0,1,2.745-.639,5.753,5.753,0,0,1,2.736.639,4.765,4.765,0,0,1,1.89,1.773,4.885,4.885,0,0,1,.684,2.574,4.885,4.885,0,0,1-.684,2.574A4.765,4.765,0,0,1,160.308-.5,5.753,5.753,0,0,1,157.572.144Zm0-2.3a2.339,2.339,0,0,0,1.773-.729,2.718,2.718,0,0,0,.693-1.953,2.718,2.718,0,0,0-.693-1.953,2.339,2.339,0,0,0-1.773-.729,2.368,2.368,0,0,0-1.782.729,2.7,2.7,0,0,0-.7,1.953,2.7,2.7,0,0,0,.7,1.953A2.368,2.368,0,0,0,157.572-2.16ZM170.64-9.828a3.985,3.985,0,0,1,2.907,1.08,4.283,4.283,0,0,1,1.107,3.2V0h-2.808V-5.112a2.524,2.524,0,0,0-.5-1.719,1.848,1.848,0,0,0-1.458-.567,2.235,2.235,0,0,0-1.692.657,2.72,2.72,0,0,0-.63,1.953V0h-2.808V-9.684h2.682V-8.55a3.724,3.724,0,0,1,1.386-.945A4.829,4.829,0,0,1,170.64-9.828Zm12.438,0a3.985,3.985,0,0,1,2.907,1.08,4.283,4.283,0,0,1,1.107,3.2V0h-2.808V-5.112a2.524,2.524,0,0,0-.5-1.719,1.848,1.848,0,0,0-1.458-.567,2.235,2.235,0,0,0-1.692.657A2.72,2.72,0,0,0,180-4.788V0h-2.808V-9.684h2.682V-8.55A3.724,3.724,0,0,1,181.26-9.5,4.829,4.829,0,0,1,183.078-9.828Zm16.146,5.022q0,.054-.054.756h-7.326a2.282,2.282,0,0,0,.936,1.422,3.1,3.1,0,0,0,1.836.522,3.718,3.718,0,0,0,1.341-.225,3.248,3.248,0,0,0,1.089-.711l1.494,1.62a5.021,5.021,0,0,1-4,1.566,6.321,6.321,0,0,1-2.9-.639A4.684,4.684,0,0,1,189.7-2.268a4.885,4.885,0,0,1-.684-2.574,4.949,4.949,0,0,1,.675-2.565,4.729,4.729,0,0,1,1.854-1.782,5.444,5.444,0,0,1,2.637-.639,5.4,5.4,0,0,1,2.574.612,4.467,4.467,0,0,1,1.809,1.755A5.233,5.233,0,0,1,199.224-4.806ZM194.2-7.7a2.418,2.418,0,0,0-1.6.54,2.3,2.3,0,0,0-.792,1.476h4.77a2.322,2.322,0,0,0-.792-1.467A2.367,2.367,0,0,0,194.2-7.7ZM205.776.144A5.954,5.954,0,0,1,203-.5a4.785,4.785,0,0,1-1.926-1.773,4.837,4.837,0,0,1-.693-2.574,4.837,4.837,0,0,1,.693-2.574A4.785,4.785,0,0,1,203-9.189a5.954,5.954,0,0,1,2.781-.639,5.388,5.388,0,0,1,2.673.639,3.79,3.79,0,0,1,1.665,1.827l-2.178,1.17a2.381,2.381,0,0,0-2.178-1.332,2.464,2.464,0,0,0-1.818.72,2.651,2.651,0,0,0-.72,1.962,2.651,2.651,0,0,0,.72,1.962,2.464,2.464,0,0,0,1.818.72,2.356,2.356,0,0,0,2.178-1.332L210.114-2.3a3.866,3.866,0,0,1-1.665,1.8A5.328,5.328,0,0,1,205.776.144Zm12.348-.612a2.886,2.886,0,0,1-1.017.459,5.142,5.142,0,0,1-1.269.153,3.77,3.77,0,0,1-2.673-.882,3.375,3.375,0,0,1-.945-2.592V-7.308h-1.494v-2.16h1.494v-2.358h2.808v2.358h2.412v2.16h-2.412v3.942a1.322,1.322,0,0,0,.315.945,1.168,1.168,0,0,0,.891.333,1.8,1.8,0,0,0,1.134-.36Zm2.826.612a1.688,1.688,0,0,1-1.242-.5,1.71,1.71,0,0,1-.5-1.26,1.643,1.643,0,0,1,.5-1.251,1.738,1.738,0,0,1,1.242-.477,1.738,1.738,0,0,1,1.242.477,1.643,1.643,0,0,1,.5,1.251,1.71,1.71,0,0,1-.5,1.26A1.688,1.688,0,0,1,220.95.144Z"
                transform="translate(684 600)"
              />
              <path
                id="logo"
                className="cls-2"
                d="M34.6,1.35a11.53,11.53,0,0,1,5.871,3.966,10.934,10.934,0,0,1,2.124,6.84,10.1,10.1,0,0,1-4.466,8.838Q33.658,24.087,25.1,24.087H2.49V-19.637H23.852q8,0,12.274,3.061A9.687,9.687,0,0,1,40.4-8.269a10.662,10.662,0,0,1-1.53,5.684A10.718,10.718,0,0,1,34.6,1.35ZM12.546-12.016V-1.71H22.6a10.152,10.152,0,0,0,5.684-1.312,4.375,4.375,0,0,0,1.936-3.873,4.3,4.3,0,0,0-1.936-3.841,10.35,10.35,0,0,0-5.684-1.28ZM24.352,16.466a11.213,11.213,0,0,0,6.028-1.312,4.492,4.492,0,0,0,2.03-4.06q0-5.434-8.058-5.434H12.546V16.466Zm41.225,8.12a20.15,20.15,0,0,1-9.525-2.217,16.484,16.484,0,0,1-6.59-6.152,16.952,16.952,0,0,1-2.374-8.932,16.952,16.952,0,0,1,2.374-8.932A16.484,16.484,0,0,1,56.051-7.8a20.15,20.15,0,0,1,9.525-2.217A19.965,19.965,0,0,1,75.07-7.8a16.535,16.535,0,0,1,6.558,6.152A16.952,16.952,0,0,1,84,7.284a16.952,16.952,0,0,1-2.374,8.932,16.535,16.535,0,0,1-6.558,6.152A19.965,19.965,0,0,1,65.576,24.586Zm0-8a8.116,8.116,0,0,0,6.152-2.53,9.43,9.43,0,0,0,2.4-6.777,9.43,9.43,0,0,0-2.4-6.777,8.116,8.116,0,0,0-6.152-2.53A8.216,8.216,0,0,0,59.393.507a9.359,9.359,0,0,0-2.436,6.777,9.359,9.359,0,0,0,2.436,6.777A8.216,8.216,0,0,0,65.576,16.591ZM103.49-10.018q7.808,0,11.993,3.716t4.185,11.212V24.087h-9.119V19.9Q107.8,24.586,100.3,24.586a15.9,15.9,0,0,1-6.715-1.312,10.012,10.012,0,0,1-4.341-3.623,9.429,9.429,0,0,1-1.5-5.247,8.756,8.756,0,0,1,3.529-7.37q3.529-2.686,10.9-2.686h7.745a6.21,6.21,0,0,0-1.936-4.9q-1.936-1.718-5.809-1.718a16.961,16.961,0,0,0-5.278.843A13.964,13.964,0,0,0,92.5.851L89-5.958a21.105,21.105,0,0,1,6.59-3A29.519,29.519,0,0,1,103.49-10.018Zm-.75,28.045a8.486,8.486,0,0,0,4.435-1.156,6.323,6.323,0,0,0,2.748-3.4V10.033h-6.683q-6,0-6,3.935a3.5,3.5,0,0,0,1.468,2.967A6.612,6.612,0,0,0,102.741,18.028ZM137.782-5.083A10.835,10.835,0,0,1,142.5-8.768a17.5,17.5,0,0,1,6.84-1.249v8.994q-1.624-.125-2.186-.125a8.932,8.932,0,0,0-6.558,2.342q-2.374,2.342-2.374,7.027V24.087h-9.744v-33.6h9.307ZM189.063-22.26V24.087h-9.307V20.214q-3.623,4.372-10.494,4.372a17.45,17.45,0,0,1-8.588-2.124,15.206,15.206,0,0,1-6.028-6.059,18.468,18.468,0,0,1-2.186-9.119,18.468,18.468,0,0,1,2.186-9.119,15.206,15.206,0,0,1,6.028-6.059,17.45,17.45,0,0,1,8.588-2.124q6.434,0,10.056,4.06v-16.3ZM170.949,16.591a8.142,8.142,0,0,0,6.121-2.53,9.359,9.359,0,0,0,2.436-6.777A9.359,9.359,0,0,0,177.07.507a8.142,8.142,0,0,0-6.121-2.53,8.216,8.216,0,0,0-6.184,2.53,9.359,9.359,0,0,0-2.436,6.777,9.359,9.359,0,0,0,2.436,6.777A8.216,8.216,0,0,0,170.949,16.591ZM232.724-9.518V18.465q0,9.244-4.81,13.742T213.86,36.7a35.149,35.149,0,0,1-9.244-1.187,20.211,20.211,0,0,1-7.246-3.435l3.873-7a15.937,15.937,0,0,0,5.372,2.78,21.374,21.374,0,0,0,6.5,1.031q5.059,0,7.464-2.28t2.4-6.9V18.278q-3.81,4.185-10.618,4.185a17.832,17.832,0,0,1-8.464-2.03,15.471,15.471,0,0,1-6.09-5.715,15.98,15.98,0,0,1-2.249-8.495,15.98,15.98,0,0,1,2.249-8.495,15.471,15.471,0,0,1,6.09-5.715,17.832,17.832,0,0,1,8.464-2.03q7.308,0,11.118,4.81v-4.31ZM214.3,14.467a8.974,8.974,0,0,0,6.34-2.28A7.743,7.743,0,0,0,223.1,6.223,7.743,7.743,0,0,0,220.637.257a8.974,8.974,0,0,0-6.34-2.28,9.087,9.087,0,0,0-6.371,2.28,7.7,7.7,0,0,0-2.5,5.965,7.7,7.7,0,0,0,2.5,5.965A9.087,9.087,0,0,0,214.3,14.467Zm41.037-24.485q7.808,0,11.993,3.716t4.185,11.212V24.087h-9.119V19.9q-2.748,4.685-10.244,4.685a15.9,15.9,0,0,1-6.715-1.312,10.013,10.013,0,0,1-4.341-3.623,9.429,9.429,0,0,1-1.5-5.247,8.756,8.756,0,0,1,3.529-7.37q3.529-2.686,10.9-2.686h7.745a6.21,6.21,0,0,0-1.936-4.9q-1.936-1.718-5.809-1.718a16.961,16.961,0,0,0-5.278.843,13.964,13.964,0,0,0-4.4,2.28l-3.5-6.808a21.1,21.1,0,0,1,6.59-3A29.519,29.519,0,0,1,255.335-10.018Zm-.75,28.045a8.486,8.486,0,0,0,4.435-1.156,6.323,6.323,0,0,0,2.748-3.4V10.033h-6.683q-6,0-6,3.935a3.5,3.5,0,0,0,1.468,2.967A6.612,6.612,0,0,0,254.585,18.028Zm68.77-28.045q6.309,0,10.025,3.716T337.1,4.848V24.087h-9.744V6.347q0-4-1.655-5.965a5.82,5.82,0,0,0-4.716-1.968A6.949,6.949,0,0,0,315.548.632q-2,2.217-2,6.59V24.087H303.8V6.347q0-7.933-6.371-7.933A6.874,6.874,0,0,0,292.062.632q-2,2.217-2,6.59V24.087h-9.744v-33.6h9.307v3.873a12.3,12.3,0,0,1,4.591-3.248,15.452,15.452,0,0,1,5.965-1.124,14.447,14.447,0,0,1,6.434,1.405,11.394,11.394,0,0,1,4.622,4.091,13.784,13.784,0,0,1,5.216-4.06A16.455,16.455,0,0,1,323.355-10.018ZM379.134,7.409q0,.187-.187,2.623H353.524a7.917,7.917,0,0,0,3.248,4.934,10.758,10.758,0,0,0,6.371,1.811A12.9,12.9,0,0,0,367.8,16a11.271,11.271,0,0,0,3.779-2.467l5.184,5.622q-4.747,5.434-13.866,5.434a21.935,21.935,0,0,1-10.056-2.217,16.255,16.255,0,0,1-6.746-6.152,16.952,16.952,0,0,1-2.374-8.932,17.173,17.173,0,0,1,2.342-8.9A16.41,16.41,0,0,1,352.494-7.8a18.889,18.889,0,0,1,9.151-2.217,18.738,18.738,0,0,1,8.932,2.124,15.5,15.5,0,0,1,6.277,6.09A18.16,18.16,0,0,1,379.134,7.409ZM361.707-2.647a8.391,8.391,0,0,0-5.559,1.874A7.977,7.977,0,0,0,353.4,4.349h16.552A8.057,8.057,0,0,0,367.2-.742,8.215,8.215,0,0,0,361.707-2.647Zm71.831,4.185h9.244V19.277a26.411,26.411,0,0,1-8.245,4.122,32.01,32.01,0,0,1-9.432,1.437,25.559,25.559,0,0,1-12.242-2.9,21.621,21.621,0,0,1-8.526-8.058,22.2,22.2,0,0,1-3.092-11.649,22.2,22.2,0,0,1,3.092-11.649,21.517,21.517,0,0,1,8.588-8.058,26.06,26.06,0,0,1,12.367-2.9,27.064,27.064,0,0,1,10.431,1.936,20.669,20.669,0,0,1,7.87,5.622l-6.5,6a15.024,15.024,0,0,0-11.306-4.934,15.431,15.431,0,0,0-7.433,1.749A12.547,12.547,0,0,0,413.3-5.083a14.524,14.524,0,0,0-1.811,7.308A14.4,14.4,0,0,0,413.3,9.471a12.812,12.812,0,0,0,5.028,4.966,14.9,14.9,0,0,0,7.339,1.78,16.4,16.4,0,0,0,7.87-1.874ZM485.318-9.518v33.6h-9.244v-4a12.923,12.923,0,0,1-4.622,3.342,14.541,14.541,0,0,1-5.809,1.156q-6.621,0-10.494-3.81T451.277,9.471V-9.518h9.744V8.034q0,8.12,6.808,8.12a7.319,7.319,0,0,0,5.622-2.28q2.124-2.28,2.124-6.777V-9.518Zm18.364,4.435A10.836,10.836,0,0,1,508.4-8.768a17.5,17.5,0,0,1,6.84-1.249v8.994q-1.624-.125-2.186-.125a8.932,8.932,0,0,0-6.558,2.342q-2.374,2.342-2.374,7.027V24.087h-9.744v-33.6h9.307ZM555.15-9.518v33.6h-9.244v-4a12.924,12.924,0,0,1-4.622,3.342,14.541,14.541,0,0,1-5.809,1.156q-6.621,0-10.494-3.81T521.109,9.471V-9.518h9.744V8.034q0,8.12,6.808,8.12a7.319,7.319,0,0,0,5.622-2.28q2.124-2.28,2.124-6.777V-9.518Z"
                transform="translate(681.39 535.678)"
              />
            </g>
          </svg>

          <div className="homeWindow"></div>
        </div>
        <div
          className="row bg-white shadow-lg p-5"
          style={{ marginTop: "100vh" }}
        >
          <div className="col-12 col-md-10 offset-md-1">
            <div className="row">
              <h1 className="text-primary font-weight-bold">Trade</h1>
            </div>
            <div className="row">
              <p>trade games and whatnot</p>
            </div>
          </div>
        </div>
        <div className="row bg-primary p-5">
          <div className="col-12 col-md-10 offset-md-1">
            <div className="row">
              <h1 className="text-white font-weight-bold">Collect</h1>
            </div>
            <div className="row">
              <p>collect games and whatnot</p>
            </div>
          </div>
        </div>
        <div className="row bg-light p-5">
          <div className="col-12 col-md-10 offset-md-1">
            <div className="row">
              <h1 className="text-primary font-weight-bold">Connect</h1>
            </div>
            <div className="row">
              <p>Connect with the community</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default withRouter(Home);
