import React, { Component } from 'react';
import './App.css';

import EmailEditor from 'react-email-editor'

//JSON file of a template from unlayer
import sample from './sample.json'

import { Modal, Button, Header, Form, Message } from 'semantic-ui-react'

import { sendEmail } from './api/index'

class App extends Component {
	constructor(props) {
		super(props);
		this.emailEditorRef = React.createRef();

		this.state = {
			isModalOpen: false,
			formObject: {
				from: "",
				subject: "",
				to: "",
				firstName: "",
				lastName: "",
				htmlContent: "",
			},
			formErrors: {}
		}
	}

	componentDidMount() {
		console.log(this.emailEditorRef.current)
	}

	onLoad = () => {
		this.emailEditorRef.current.loadDesign(sample)
	}

	exportHtml = () => {
		const { formObject } = this.state;

		this.emailEditorRef.current.exportHtml((data) => {
			const { design, html } = data;
			console.log('exported');

			formObject["htmlContent"] = html;

			this.setState({ formObject: formObject })
		});
	};

	saveDesign = () => {
		this.emailEditorRef.current.saveDesign((design) => {
			console.log('saveDesign', design);
			alert('Design JSON has been logged in your developer console.');
		});
	};

	handleModal = () => {
		const { isModalOpen } = this.state;

		this.setState({ isModalOpen: !isModalOpen })
	}

	handleFormValidation = () => {
		const { formObject, formErrors } = this.state;
		let formIsValid = true;

		//Validate email format
		if (!new RegExp(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g).test(formObject["from"])) {
			formErrors["from"] = "Please enter a valid email address."
		}
		else {
			delete formErrors["from"];
		}
		if (!new RegExp(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g).test(formObject["to"])) {
			formErrors["to"] = "Please enter a valid email address."
		}
		else {
			delete formErrors["to"];
		}

		//Validate empty fields
		if (!formObject["subject"]) {
			formIsValid = false;
			formErrors["subject"] = "Field cannot be empty."
		}
		else {
			delete formErrors["subject"];
		}

		this.setState({ formErrors: formErrors })

		return formIsValid;
	}

	handleFormObject = (key, value) => {
		const { formObject } = this.state;

		formObject[key] = value;

		this.setState({
			formObject: formObject
		})
	}

	sendEmail = () => {
		const { formObject } = this.state;

		if (this.handleFormValidation()) {
			
			this.exportHtml();

			sendEmail(formObject)

			this.handleModal();
		}
		else {

		}
	}

	render() {
		const { isModalOpen, formObject, formErrors } = this.state;
		return (
			<div className="container">
				<div className="topbar">
					<Header as="h1">Email Sending</Header>
					<Button onClick={this.handleModal}>Send Email</Button>
					<Button onClick={this.saveDesign}>Save Design</Button>
					<Button onClick={this.exportHtml}>Export HTML</Button>
				</div>
				<EmailEditor
					ref={this.emailEditorRef}
					onLoad={this.onLoad}
				/>

				<div>
					<Modal
						onClose={this.handleModal}
						onOpen={this.handleModal}
						open={isModalOpen}
					>
						<Modal.Header>Email Form</Modal.Header>
						<Modal.Content>
							<Form>
								<Form.Group widths="equal">
									<Form.Input
										label='From'
										placeholder='joe@schmoe.com'
										error={formErrors["from"] ?
											{
												content: formErrors["from"],
												pointing: 'below',
											} : null
										}
										onChange={(e) => this.handleFormObject("from", e.target.value)}
									/>
								</Form.Group>
								<Form.Group widths="equal">
									<Form.Input
										label='Subject'
										placeholder='Enjoy your Summer break !!!!!'
										error={formErrors["subject"] ?
											{
												content: formErrors["subject"],
												pointing: 'below',
											} : null
										}
										onChange={(e) => this.handleFormObject("subject", e.target.value)}
									/>
								</Form.Group>
								<Form.Group widths="equal">
									<Form.Input
										label='To'
										placeholder='joe@schmoe.com'
										error={formErrors["to"] ?
											{
												content: formErrors["to"],
												pointing: 'below',
											} : null
										}
										onChange={(e) => this.handleFormObject("to", e.target.value)}
									/>
								</Form.Group>
								<Form.Group widths="equal">
									<Form.Input
										fluid label='First Name'
										placeholder='First name'
										onChange={(e) => this.handleFormObject("firstName", e.target.value)}
									/>
									<Form.Input
										fluid label='Last Name '
										placeholder='Last Name'
										onChange={(e) => this.handleFormObject("lastName", e.target.value)}
									/>
								</Form.Group>
							</Form>
						</Modal.Content>
						<Modal.Actions>
							<Button onClick={this.handleModal}>Cancel</Button>
							<Button primary onClick={this.sendEmail}>Send</Button>
						</Modal.Actions>
					</Modal>
				</div>
			</div>
		);
	}
}

export default App;
