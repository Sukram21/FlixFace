import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import FaceTracker from './face-tracker';
import FieldGroup from './fieldgroup';
import Environment from '../environment';
import { dataURItoBlob } from '../common-methods';

class Add extends Component {
  constructor() {
    super();
    this.state = {
      message: ""
    }
  }

  render() {
    return (
      <form onSubmit={this.addUser}>
        <FieldGroup
          id="formControlsName"
          type="text"
          label="Name"
          name="name"
          placeholder="Enter your name"
          required
          />

        <Button
          onClick={this.takePhoto}
          >
          Take Photo
        </Button>

        <Button
          type="submit"
          >
          Register
        </Button>

        <div>
          {this.state.message}
        </div>          

        <FaceTracker ref="tracker"/>
      </form>
    );
  }

  addUser = (event) => {
    event.preventDefault();

    let form = document.querySelector('form');

    // Register the user on the backend, but only if he has (1) entered his name and (2) taken a photo with correct face visible
    if (!form.name || !this.state.faceImage) return; // TODO: Show the user that he isn't finished entering his information

    let formData = new FormData(form);
    formData.append("image", dataURItoBlob(this.state.faceImage));

    fetch(Environment.backendUrl + '/add', {
      method: 'POST',
      body: formData
    })
      .then(response => response.text())
      .then(responseText => this.setState({
        message: responseText
      }))
      .catch((error) => this.setState({
        message: "Error, please try again! Error was: " + error
      }))
  }

  takePhoto = (event) => {
    this.setState({
      message: ""
    });

    const tracker = this.refs.tracker;
    if(tracker.getNumberOfFaces() === 1){
      this.setState({
        faceImage: tracker.getFace(),
        message: "Photo of face was successfully taken!"
      })
    } else {
      this.setState({
        faceImage: null,
        message: "Face could not be found. Please try again."
      })
    }
  }
}

export default Add;
