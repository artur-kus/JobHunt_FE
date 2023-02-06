import React, {Component} from 'react';


class ThanksYouPage extends Component {
    render() {
        return (
            <div>
                <h1>Thank you for registering!</h1>
                <p>You can log in with the details used during the sign-up process.</p>
                <a href="http://www.localhost:8011/">
                    <input type="button" value="Back to home"/>
                </a>
            </div>
        );
    }
}

export default ThanksYouPage;