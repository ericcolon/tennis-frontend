import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import axios from 'axios'
import Select from './mySelect'

const suggestions = [
  { label: 'Afghanistan' },
  { label: 'Aland Islands' },
  { label: 'Albania' },
  { label: 'Algeria' },
  { label: 'American Samoa' },
  { label: 'Andorra' },
  { label: 'Angola' },
  { label: 'Anguilla' },
  { label: 'Antarctica' },
  { label: 'Antigua and Barbuda' },
  { label: 'Argentina' },
  { label: 'Armenia' },
  { label: 'Aruba' },
  { label: 'Australia' },
  { label: 'Austria' },
  { label: 'Azerbaijan' },
  { label: 'Bahamas' },
  { label: 'Bahrain' },
  { label: 'Bangladesh' },
  { label: 'Barbados' },
  { label: 'Belarus' },
  { label: 'Belgium' },
  { label: 'Belize' },
  { label: 'Benin' },
  { label: 'Bermuda' },
  { label: 'Bhutan' },
  { label: 'Bolivia, Plurinational State of' },
  { label: 'Bonaire, Sint Eustatius and Saba' },
  { label: 'Bosnia and Herzegovina' },
  { label: 'Botswana' },
  { label: 'Bouvet Island' },
  { label: 'Brazil' },
  { label: 'British Indian Ocean Territory' },
  { label: 'Brunei Darussalam' },
].map(suggestion => ({
  value: suggestion.label,
  label: suggestion.label,
}));

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
    this.setState({
      isLoaded: true,
      message: this.returnWinner(res.data.home, res.data.away),
      homeValue: res.data.home + "%",
      awayValue: res.data.away + "%"
    })
  }).catch(err => {
    this.setState({
      isLoaded: true,
      message: err
    });
  })
    this.setState({message: "Loading ...", homeValue: "", awayValue: "", isLoaded: false});
  };

  handleInputChange = name => value => {
    // if (this.state.isLoaded) {
    //   this.setState({
    //     [event.target.name]: event.target.value
    //   });
    // }
    var body = "player=" + value
    axios({
      url: 'http://localhost:5000/api/player',
      method: 'post',
      data: encodeURI(body)
    }).then(res => {
      var tab = []
      res.ForEach(val => {
        tab.push({"label": val});
      })
      tab.map(opt => ({
        value: opt.label,
        label: opt.label,
      }));
      this.setState({
        ["options_" + name]: tab
      })
    }).catch(err => {
      this.setState({
        message: "" + err
      });
    })

    //load the api with the right value
    console.log("in", name, value);
  }

  handleOnChange = name => value => {
    this.setState({
      [name]: value.value
    });
    console.log("on", name, value);
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
                options={this.props.options}
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
                options={this.props.options}
                onChange={this.handleInputChange('away')}
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
