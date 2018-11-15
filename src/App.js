/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   App.js                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: pleroux <pleroux@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/11/15 17:56:56 by pleroux           #+#    #+#             */
/*   Updated: 2018/11/15 17:57:18 by pleroux          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import React, { Component } from 'react';
import './App.css';
import MyPredict from './components/MyGrid'

class App extends Component {
  render() {
    return (
      <div className="App">
        <MyPredict />
      </div>
    );
  }
}

export default App
