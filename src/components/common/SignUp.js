import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useOktaAuth } from '@okta/okta-react';
import newAxios from '../../utils/axiosUtils';
import { getOktaAuthToken } from '../../utils/oktaUtils';

import {
  Form,
  Input,
  Tooltip,
  Cascader,
  Select,
  Row,
  Col,
  Checkbox,
  Radio,
  Button,
  AutoComplete,
} from 'antd';
// const {  QuestionCircleOutlined  } = icons;
const { Option } = Select;
const AutoCompleteOption = AutoComplete.Option;
const formItemLayout = {
  labelCol: {
    xl: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    //   xs: {
    //     span: 24,
    //   },
    //   sm: {
    //     span: 16,
    //   },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    // xl: {
    //   span: 24,
    //   offset: 0,
    // },
    // sm: {
    //   span: 16,
    //   offset: 8,
    // },
  },
};

const allowedAccounts = new Set([
  'llama001@maildrop.cc',
  'llama002@maildrop.cc',
  'llama003@maildrop.cc',
  'llama004@maildrop.cc',
]);

export default function SignUp({ enabled }) {
  const { authService } = useOktaAuth();

  const [form] = Form.useForm();

  const onFinish = values => {
    console.log('Received values of form: ', values);
    // create OKTA user
    // 1. check values['email'] against 4 allowed user emails
    if (!allowedAccounts.has(values['email'])) {
      // return some error
    }
    // 2. normally, call OKTA's new user api method
    // -> in our special case, perform regular authentication
    authService.login();

    // 3. at this point we have an Okta auth token

    // build userData based on
    const userData = {
      first_name: values['firstName'],
      last_name: values['lastName'],
      email: values['email'],
    };

    const axios = newAxios(authService.authState.idToken);
    axios
      .post('/users', userData)
      .then(res => {
        console.log(res.data);
      })
      .catch(err => {
        console.log('error', err);
      });

    /*
    /login - GET /user --> (returns user profile info)
    /signup - POST /users --> { firstname, lastname, etc. }
    */
  };

  const [autoCompleteResult, setAutoCompleteResult] = useState([]);

  const onWebsiteChange = value => {
    if (!value) {
      setAutoCompleteResult([]);
    } else {
      setAutoCompleteResult(
        ['.com', '.org', '.net'].map(domain => `${value}${domain}`)
      );
    }
  };

  return (
    <div disabled={!enabled}>
      <Form
        {...formItemLayout}
        form={form}
        className="signUpForm"
        name="register"
        onFinish={onFinish}
        scrollToFirstError
      >
        <div className="title">CREATE AN ACCOUNT</div>

        <div className="formTop">
          <Form.Item
            name="firstName"
            className="firstName"
            // className="test"
            label="First Name"
            rules={[
              {
                required: true,
                message: 'Please enter your First Name',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="lastName"
            className="lastName"
            // className="test"
            label="Last Name"
            rules={[
              {
                required: true,
                message: 'Please enter your Last Name',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="schoolEnrolled"
            className="school"
            // className="test"
            label="School Enrolled"
            rules={[
              {
                required: true,
                message: 'Please enter your school that your enrolled into',
              },
            ]}
          >
            <Select>
              <Select.Option value="mills">Mills</Select.Option>
              <Select.Option value="laney">Laney</Select.Option>
              <Select.Option value="merritt">Merritt</Select.Option>
              <Select.Option value="lincoln">Lincoln</Select.Option>
              <Select.Option value="stanford">Stanford</Select.Option>
              <Select.Option value="santaClara">Santa Clara</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="username"
            className="userName"
            // className="test"
            label="BRIDGEGOOD Username"
            rules={[
              {
                required: true,
                message: 'Please enter your username',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </div>

        <Form.Item
          name="email"
          className="email"
          // className="test2"
          label="Email"
          rules={[
            {
              type: 'email',
              message: 'The email provided is not valid',
            },
            {
              required: true,
              message: 'Please enter your E-mail',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <div className="formBottom">
          <Form.Item
            name="phone"
            className="phoneNumber"
            // className="test"
            label="Phone Number"
            rules={[
              {
                required: true,
                message: 'Please enter your phone number',
              },
            ]}
          >
            <Input
            // addonBefore={prefixSelector}
            // style={{
            //   width: '100%',
            // }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            className="password"
            // className="test"
            label="Password"
            rules={[
              {
                required: true,
                message: 'Please enter your password!',
              },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>
        </div>
        <div className="formFooter">
          <Form.Item
            name="agreement"
            // className="test8"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject('Please accept agreement'),
              },
            ]}
            {...tailFormItemLayout}
          >
            {/* <Radio> */}
            <Checkbox className="check">
              By checking this, I confirm that I am 18 years of age and older
              <br />
              and I agree to follow the terms for using this space.
              {/* </Radio> */}
            </Checkbox>
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button
              className="btn"
              size="large"
              type="primary"
              htmlType="submit"
            >
              Create Account
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
}
