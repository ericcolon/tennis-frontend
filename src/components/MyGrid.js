import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';

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
      isLoaded: false,
      message: "",
      homeValue: "",
      awayValue: "",
      spacing: 16
    }

    this.handleClick = this.handleClick.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  handleClick = () => {
    const body = "home=" + this.state.home + "&away=" + this.state.away
    fetch("http://localhost:8080/api/predict",
    {
      method: 'post',
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
      },
      body: encodeURI(body)
    })
      .then(res => res.json())
      .then((res) => {
        this.setState({
          isLoaded: true,
          message: this.returnWinner(),
          homeValue: res.home + "%",
          awayValue: res.away + "%"
        })
      }, (err) => {
        this.setState({
          isLoaded: true,
          message: "Error: " + err
        });
      });
    this.setState({message: "Loading ..."});
  };

  handleInputChange = (event) => {
    this.setState({
            [event.target.name]: event.target.value
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
              <p>{ this.homeValue }</p>
            </Grid>
            <Grid item>
              <Button variant="contained" color="primary" className={classes.button} onClick={this.handleClick} >
                Predict
              </Button>
            </Grid>
            <Grid item>
              <p>{ this.awayValue }</p>
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
