import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { Platform, SegmentedControlIOS, Dimensions, View } from 'react-native';
import { Navigator } from 'react-native-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialTabs from 'react-native-material-tabs';

import preventNavStackDuplicate from '../../hocs/preventNavStackDuplicate';

// Components
import Bundestag from './Bundestag';
import Fraktionen from './Fraktionen';

const Wrapper = styled.View`
  flex: 1;
  background-color: #fff;
`;

const SegmentControlsWrapper = styled.View`
  background-color: #4494d3;
  height: 50;
  padding-left: 16;
  padding-right: 16;
  flex-direction: row;
  justify-content: center;
  padding-bottom: 10;
`;

const ScrollView = styled.ScrollView.attrs(() => ({
  horizontal: true,
  pagingEnabled: true,
}))`
  flex: 1;
`;

class WahlOMeter extends Component {
  static navigatorStyle = {
    navBarButtonColor: '#FFFFFF',
    navBarBackgroundColor: '#4494d3',
    navBarTextColor: '#FFFFFF',
    navBarTextFontSize: 17,
  };

  constructor(props) {
    super(props);

    if (!props.noMenu) {
      const menuIcon = Platform.OS === 'ios' ? 'ios-menu' : 'md-menu';

      Ionicons.getImageSource(menuIcon, 24, '#FFFFFF').then(icon => {
        props.navigator.setButtons({
          leftButtons: [
            {
              icon,
              id: 'menu',
            },
          ],
        });
      });
    }
  }

  state = {
    width: Dimensions.get('window').width,
    selectedIndex: 0,
    routes: ['Bundestag', 'Fraktionen'],
  };

  onProcedureListItemClick = ({ item }) => () => {
    this.props.navigateTo({
      screen: 'democracy.Detail',
      title: 'Abstimmung'.toUpperCase(),
      passProps: { ...item },
      backButtonTitle: '',
    });
  };

  onScrollEndDrag = e => {
    const { contentOffset } = e.nativeEvent;
    const viewSize = e.nativeEvent.layoutMeasurement;
    // Divide the horizontal offset by the width of the view to see which page is visible
    const pageNum = Math.floor(contentOffset.x / viewSize.width);
    if (this.state.selectedIndex !== pageNum) {
      this.setState({ selectedIndex: pageNum });
    }
  };

  onLayout = () => {
    const { width } = Dimensions.get('window');
    if (this.state.width !== width) {
      this.setState({
        width,
      });
    }
  };

  width = Dimensions.get('window').width;

  render() {
    const { selectedIndex, width, routes } = this.state;
    let bundestagScreen = (
      <View key="bundestag" style={{ flex: 1, width: width }}>
        <Bundestag
          onProcedureListItemClick={this.onProcedureListItemClick}
          navigator={this.props.navigator}
        />
      </View>
    );
    let fraktionenScreen = (
      <View key="fraktionen" style={{ flex: 1, width: width }}>
        <Fraktionen
          onProcedureListItemClick={this.onProcedureListItemClick}
          navigator={this.props.navigator}
        />
      </View>
    );
    return (
      <Wrapper onLayout={this.onLayout}>
        {Platform.OS === 'ios' && (
          <>
            <SegmentControlsWrapper>
              <SegmentedControlIOS
                style={{
                  alignSelf: 'flex-end',
                  width: '100%',
                }}
                values={routes}
                tintColor="#ffffff"
                selectedIndex={selectedIndex}
                onChange={event => {
                  this.setState({
                    selectedIndex: event.nativeEvent.selectedSegmentIndex,
                  });
                  this.scrollView.scrollTo({
                    y: 0,
                    x: event.nativeEvent.selectedSegmentIndex * this.state.width,
                  });
                }}
              />
            </SegmentControlsWrapper>

            <ScrollView
              onContentSizeChange={() => {
                this.scrollView.scrollTo({
                  y: 0,
                  x: selectedIndex * this.state.width,
                });
              }}
              onMomentumScrollEnd={this.onScrollEndDrag}
              ref={e => {
                this.scrollView = e;
              }}
            >
              {[bundestagScreen, fraktionenScreen]}
            </ScrollView>
          </>
        )}
        {Platform.OS === 'android' && (
          <>
            <MaterialTabs
              items={routes}
              selectedIndex={selectedIndex}
              onChange={selectedIndex => {
                this.setState({
                  selectedIndex,
                });
                this.scrollView.scrollTo({
                  y: 0,
                  x: selectedIndex * this.state.width,
                });
              }}
            />

            <ScrollView
              onContentSizeChange={() => {
                this.scrollView.scrollTo({
                  y: 0,
                  x: selectedIndex * this.state.width,
                });
              }}
              onMomentumScrollEnd={this.onScrollEndDrag}
              ref={e => {
                this.scrollView = e;
              }}
            >
              {[bundestagScreen, fraktionenScreen]}
            </ScrollView>
          </>
        )}
      </Wrapper>
    );
  }
}

WahlOMeter.propTypes = {
  navigator: PropTypes.instanceOf(Navigator).isRequired,
  navigateTo: PropTypes.func.isRequired,
  noMenu: PropTypes.bool,
};

WahlOMeter.defaultProps = {
  noMenu: false,
};

export default preventNavStackDuplicate(WahlOMeter);
