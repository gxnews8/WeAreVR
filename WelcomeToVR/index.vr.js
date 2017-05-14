import React from 'react';
import {
  AppRegistry,
  asset,
  StyleSheet,
  Pano,
  Text,
  View,
  Model,
  PointLight,
  Box,
  Cylinder,
  Plane,
  Scene,
  Sound,
  Sphere,
} from 'react-vr';

export default class WelcomeToVR extends React.Component {

  constructor() {
    super();
    this.state = {rotation: 0};
    this.lastUpdate = Date.now();
    this.rotate = this.rotate.bind(this);
  }

  rotate() {
    const now = Date.now();
    const delta = now - this.lastUpdate;
    this.lastUpdate = now;

    this.setState({rotation: this.state.rotation + delta / 20});
    this.frameHandle = requestAnimationFrame(this.rotate);
  }

  componentDidMount() {
    this.rotate();
  }

  componentWillUnmount() {
    if (this.frameHandle) {
      cancelAnimationFrame(this.frameHandle);
      this.frameHandle = null;
    }
  }

  render() {
    return (
      <View>
        <Pano source={asset('Brompton.jpg')} />
        <Sphere
          style={{
            transform: [
              {translate: [0, 0, -3]},
              // {scale: 0.1},
              // {rotateX: this.state.rotation},
              {rotateY: this.state.rotation},
              // {rotateZ: this.state.rotation},
            ],
          }}
          texture={asset('Brompton.jpg')}
          // lit={true}
          // wireframe={true}
          // Box
          // dimWidth={20}
          // dimDepth={20}
          // dimHeight={20}
          // Cylinder
          // radiusTop={10}
          // radiusBottom={10}
          // dimHeight={20}
          // segments={360}
          // Plane
          // dimWidth={20}
          // dimHeight={20}
          // Sphere
          radius={1.5}
          widthSegments={-20}
          heightSegments={20}
        />
      </View>
    );
  }
};

AppRegistry.registerComponent('WelcomeToVR', () => WelcomeToVR);
