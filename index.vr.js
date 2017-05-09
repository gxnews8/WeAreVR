/**
 * Example ReactVR app that allows a simple app using linked 360 photos.
 */
'use strict';

import React from 'react';
import {
  AppRegistry,
  asset,
  Image,
  Sound,
  Pano,
  Text,
  View,
} from 'react-vr';

import InfoButton from './components/InfoButton';
import NavButton from './components/NavButton';
import LoadingSpinner from './components/LoadingSpinner';

/**
 * ReactVR component that allows a simple app using linked 360 photos.
 * App includes nav buttons, activated by gaze-and-fill or direct selection,
 * that move between app locations and info buttons that display tooltips with
 * text and/or images. Tooltip data and photo URLs are read from a JSON file.
 */
class WeAreVR extends React.Component {

  static defaultProps = {
    hotelSource: 'hotelDataMini.json',
  };

  constructor(props) {
    super(props);
    this.state = {
      data: null,
      locationId: null,
      nextLocationId: null,
      rotation: null,
    };
    this.lastUpdate = Date.now();
    this.rotate     = this.rotate.bind(this);
    // Set back UI elements from the camera (which is positioned at origin).
    this.translateZ = -3;
  }

  rotate() {
    const now       = Date.now();
    const delta     = now - this.lastUpdate;
    this.lastUpdate = now;
    this.setState({rotation: this.state.rotation + delta / 360});
    this.frameHandle = requestAnimationFrame(this.rotate);
  }

  componentDidMount() {
    this.rotate();
    fetch(asset(this.props.hotelSource).uri)
      .then((response) => response.json())
      .then((responseData) => {
        this.init(responseData);
      })
      .done();
  }

  init(appConfig) {
    // Initialize the app based on data file.
    this.setState({
      data: appConfig,
      locationId: null,
      nextLocationId: appConfig.firstPhotoId,
      rotation: appConfig.firstPhotoRotation +
        (appConfig.photos[appConfig.firstPhotoId].rotationOffset || 0),
    });
  }

  render() {
    if (!this.state.data) {
      return null;
    }

    const locationId = this.state.locationId;
    const photoData = (locationId && this.state.data.photos[locationId]) || null;
    const tooltips = (photoData && photoData.tooltips) || null;
    const rotation = this.state.data.firstPhotoRotation +
      ((photoData && photoData.rotationOffset) || 0);
    const isLoading = this.state.nextLocationId !== this.state.locationId;

    return (

      <View>
        <View style={{transform:[{rotateY: this.state.rotation}]}}>
          <Sound loop={false} source={asset(this.state.data.bgMusic)} />
          <Pano
            // Place pano in world, and by using position absolute it does not
            // contribute to the layout of other views.
            style={{
              position: 'absolute',
              backgroundColor: isLoading ? 'black' : 'white',
              // transform: [{rotateY: this.state.rotation}],
            }}
            onLoad={() => {
              const data = this.state.data;
              this.setState({
                // Now that ths new photo is loaded, update the locationId.
                locationId: this.state.nextLocationId,
              });
            }}
            source={asset(this.state.data.photos[this.state.nextLocationId].uri)}
          />

          {tooltips && tooltips.map((tooltip, index) => {
            // Iterate through items related to this location, creating either
            // info buttons, which show tooltip on hover, or nav buttons, which
            // change the current location in the app.
            if (tooltip.type) {
              return(
                <InfoButton
                  key={index}
                  rotateY={tooltip.rotationY}
                  source={asset(this.state.data.info_icon)}
                  tooltip={tooltip}
                  translateZ={this.translateZ}
                />
              );
            }
            return(
              <NavButton
                key={tooltip.linkedPhotoId}
                isLoading={isLoading}
                onInput={() => {
                  // Update nextLocationId, not locationId, so tooltips match
                  // the currently visible pano; pano will update locationId
                  // after loading the new image.
                  this.setState({nextLocationId: tooltip.linkedPhotoId});
                }}
                rotateY={tooltip.rotationY}
                source={asset(this.state.data.nav_icon)}
                onEnterSound={asset(this.state.data.onEnterSound)}
                textLabel={tooltip.text}
                translateZ={this.translateZ}
              />
            );
          })}
        </View>
        {locationId == null &&
          // Show a spinner while first pano is loading. Adjust layoutOrigin
          // so it appears in center of screen. Nav Buttons also show a spinner
          // if there is a delay is loading the next pano.
          <View
            style={{
              transform: [{translateZ: this.translateZ}],
              layoutOrigin: [0.5, 0.5, 0],
            }}
            height={0.5}
            width={0.5}
          >
            <LoadingSpinner />
          </View>
        }
      </View>
    );
  }
};

// Name used to create module, via reactNativeContext.createRootView('WeAreVR')
AppRegistry.registerComponent('WeAreVR', () => WeAreVR);
module.exports = WeAreVR;
