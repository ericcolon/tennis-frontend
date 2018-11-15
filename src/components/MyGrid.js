/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   MyGrid.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: pleroux <pleroux@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/11/15 17:56:26 by pleroux           #+#    #+#             */
/*   Updated: 2018/11/15 17:56:30 by pleroux          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import axios from 'axios'
import Select from './mySelect'

const styles = theme => ({
  root: {
    padding: 20,
    flexGrow: 1,
  },
  inputRight: {
    textAlign: 'right'
  },
  button: {
    margin: theme.spacing.unit,
  },
  select: {
    width: 100,
  }
});

class MyGrid extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: true,
      message: "",
      homeValue: "",
      awayValue: "",
      home: "",
      away: "",
      spacing: 16,
      options_home: [],
      options_away: [],
    }

    this.handleClick = this.handleClick.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  returnWinner = (h, a) => {
    if (parseInt(h) > parseInt(a)) {
      return this.state.home + " is Winner"
    }
    return this.state.away + " is Winner"
  }

  handleClick = () => {
    var body = "home=" + this.state.home + "&away=" + this.state.away
    axios({
      url: 'http://localhost:5000/api/predict',
      method: 'post',
      data: encodeURI(body)
    }).then(res => {
      if (!res.data.away || !res.data.home) {
        throw "No player home or/and away found"
      }
      this.setState({
        isLoaded: true,
        message: this.returnWinner(res.data.home, res.data.away),
        homeValue: res.data.home + "%",
        awayValue: res.data.away + "%"
      })
    }).catch(err => {
    this.setState({
      isLoaded: true,
      message: "" + err
    });
  })
    this.setState({message: "Loading ...", homeValue: "", awayValue: "", isLoaded: false});
  };

  handleInputChange = name => value => {
    if (!value || value == "") {
      return 
    }
    
    var body = "player=" + value
    axios({
      url: 'http://localhost:5000/api/player',
      method: 'post',
      data: encodeURI(body)
    }).then(res => {
      if (!res.data.data) {
        return 
      }
      var tab = []
      Object.keys(res.data.data).map((val) => {
        tab.push({
          "value": res.data.data[val],
          "label": res.data.data[val]
        });
      })
      this.setState({
        ["options_" + name]: tab
      })
    }).catch(err => {
      this.setState({
        message: "" + err
      });
    })
  }

  handleOnChange = name => value => {
    this.setState({
      [name]: value.value
    });
  }

  render() {
    const { classes } = this.props;
    const { spacing } = this.state;

    return (
      <Grid container className={classes.root} spacing={16}>
        <Grid item xs={12}>
          <Grid container justify="center" spacing={Number(spacing)}>
            <Grid item>
              <Select
                className={classes.select}
                options={this.state.options_home}
                onChange={this.handleOnChange('home')}
                onInputChange={this.handleInputChange('home')}
              />
            </Grid>
            <Grid item>
              <h5>Vs</h5>
            </Grid>
            <Grid item>
              <Select
                className={classes.select}
                options={this.state.options_away}
                onChange={this.handleOnChange('away')}
                onInputChange={this.handleInputChange('away')}
              />
            </Grid>
          </Grid>
          <Grid container justify="center" spacing={Number(spacing)}>
            <Grid item>
              <p>{ this.state.homeValue }</p>
            </Grid>
            <Grid item>
              <Button variant="contained" color="primary" className={classes.button} onClick={this.handleClick} >
                Predict
              </Button>
            </Grid>
            <Grid item>
              <p>{ this.state.awayValue }</p>
            </Grid>
          </Grid>
          <Grid container justify="center" spacing={Number(spacing)}>
            <Grid item>
              <p>{ this.state.message }</p>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

MyGrid.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MyGrid);
