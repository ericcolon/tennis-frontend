import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import axios from 'axios'

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
      single: null
    }

    this.handleClick = this.handleClick.bind(this)
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
      data: body
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
      message: "Error: " + err
    });
  })
    this.setState({message: "Loading ...", homeValue: "", awayValue: "", isLoaded: false});
  };

  handleInputChange = (event) => {
    if (this.state.isLoaded) {
      this.setState({
        [event.target.name]: event.target.value
      });
    }
  }

  handleChange = name => value => {
    this.setState({
      [name]: value,
    });
  };

  render() {
    const { classes } = this.props;
    const { spacing } = this.state;

    return (
      <Grid container className={classes.root} spacing={16}>
        <Grid item xs={12}>
          <Grid container justify="center" spacing={Number(spacing)}>
            <Grid item>
              <Input name="home" onChange={this.handleInputChange} />
            </Grid>
            <Grid item>
              <h5>Vs</h5>
            </Grid>
            <Grid item>
              <Input name="away" onChange={this.handleInputChange} className={classes.inputRight} />
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
