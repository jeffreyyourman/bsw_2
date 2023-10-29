import * as React from "react";
import { navigate } from "gatsby-link";
import Layout from "../../components/layouts/Layout";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
function encode(data) {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");
}

export default class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isValidated: false, reason: "" };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };


  handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: encode({
        "form-name": form.getAttribute("name"),
        ...this.state,
      }),
    })
      .then(() => navigate(form.getAttribute("action")))
      .catch((error) => alert(error));
  };

  render() {
    return (
      <Layout>
        <section className="section">
          <div className="container">
            <div className="content">
              <h1>Contact</h1>
              <form
                name="contact"
                method="post"
                action="/contact/thanks/"
                data-netlify="true"
                data-netlify-honeypot="bot-field"
                onSubmit={this.handleSubmit}
              >
                {/* The `form-name` hidden field is required to support form submissions without JavaScript */}
                <input type="hidden" name="form-name" value="contact" />
                <div hidden>
                  <label>
                    Don’t fill this out:{" "}
                    <input name="bot-field" onChange={this.handleChange} />
                  </label>
                </div>

                <div className="field">
                  <FormControl style={{ marginBottom: "24px", width: "400px", backgroundColor: "white" }}>
                    <InputLabel htmlFor="name">Your name</InputLabel>
                    <TextField
                      id="name"
                      type="text"
                      name="name"
                      value={this.state.name}
                      onChange={this.handleChange}
                      fullWidth
                    />
                  </FormControl>
                </div>

                <div className="field">
                  <FormControl style={{ marginBottom: "24px", width: "400px", backgroundColor: "white" }}>
                    <InputLabel htmlFor="email">Email</InputLabel>
                    <TextField
                      id="email"
                      type="email"
                      name="email"
                      value={this.state.email}
                      onChange={this.handleChange}
                      fullWidth
                    />
                  </FormControl>
                </div>

                <div className="field">
                  <FormControl style={{ marginBottom: "24px", width: "400px", backgroundColor: "white" }}>
                    <InputLabel id="reason-label">Reason</InputLabel>
                    <Select
                      labelId="reason-label"
                      label="Reason"
                      name="reason"
                      value={this.state.reason}
                      onChange={this.handleChange}
                      fullWidth
                    >
                      <MenuItem value={"Feature Request"}>Feature Request</MenuItem>
                      <MenuItem value={"Issue Request"}>Issue Request</MenuItem>
                      <MenuItem value={"Account Issue"}>Account Issue</MenuItem>
                      <MenuItem value={"Website Issue"}>Website Issue</MenuItem>
                      <MenuItem value={"Other"}>Other</MenuItem>
                    </Select>
                  </FormControl>
                </div>

                <div className="field">
                  <FormControl style={{ marginBottom: "24px", width: "400px", backgroundColor: "white" }}>
                    <InputLabel htmlFor="message">Message</InputLabel>
                    <TextField
                      id="message"
                      name="message"
                      value={this.state.message}
                      onChange={this.handleChange}
                      fullWidth
                      multiline
                      rows={4}
                    />
                  </FormControl>
                </div>

                <div className="field">
                  <button className="button is-link" type="submit">
                    Send
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </Layout>
    );
  }
}
