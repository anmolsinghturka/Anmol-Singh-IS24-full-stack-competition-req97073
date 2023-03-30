import {
    Box,
    Center, // add this line
    Container,
    Text
} from '@chakra-ui/react';
import './index.css';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Avatar, Popconfirm, Typography, Button, DatePicker, Form, Input, Modal, Radio, Table, Tag } from 'antd';
import { FormControl } from '@chakra-ui/react';
import { useContext, useEffect, useState, React } from 'react';
import { GlobalContext } from './context/GlobalWrapper';
import axios from 'axios';
import DrawerExample from './components/DrawerExample';
import { SearchOutlined } from '@ant-design/icons';
import moment from 'moment';

const formItemLayout = {
    labelCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 4,
        },
    },
    wrapperCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 20,
        },
    },
};

const config = {
    rules: [
        {
            type: 'object',
            required: true,
            message: 'Please select time!',
        },
    ],
};

const CollectionCreateForm = ({ open, onCreate, onCancel, product, setProduct }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue({
            _id: product._id,
            productName: product.productName,
            productOwnerName: product.productOwnerName,
            developers: product.developers,
            scrumMasterName: product.scrumMasterName,
            startDate: product.startDate ? moment(new Date(product.startDate)) : null,
            methodology: product.methodology,
        });
    }, [form, product]);

    return (
        <Modal
            open={open}
            title="Create a new Project"
            okText="Save"
            cancelText="Cancel"
            onCancel={() => {
                onCancel();
                form.resetFields();
            }}
            onOk={() => {
                form
                    .validateFields()
                    .then((values) => {
                        if (product._id) {
                            values = {
                                ...values,
                                '_id': product._id,
                                'productId': product.productId
                            };
                            setProduct("");
                        }
                        onCreate(values)
                        form.resetFields();
                    })
                    .catch((info) => {
                        console.log('Validate Failed:', info);
                    });
            }}
        >
            <Form
                form={form}
                layout="vertical"
                name="form_in_modal"
                initialValues={{}}
            >
                <Form.Item name="productName"
                    label="Product Name"
                    rules={[
                        {
                            required: true,
                            message: 'Please input the title of collection!',
                        },
                    ]}
                >
                    <Input type="textarea" />
                </Form.Item>
                <Form.Item name="productOwnerName"
                    label="Product Owner Name"
                    rules={[
                        {
                            required: true,
                            message: 'Please input the Product Owner Name!',
                        },
                    ]}>
                    <Input type="textarea" />
                </Form.Item>
                <Form.List
                    name="developers"
                    style={{ maxWidth: 600 }}
                    rules={[
                        {
                            validator: async (_, names) => {
                                if (!names || names.length < 2) {
                                    return Promise.reject(new Error('At least 2 developers'));
                                }
                            },
                        },
                    ]}
                >
                    {(fields, { add, remove }, { errors }) => (
                        <>
                            {fields.map((field, index) => (
                                <Form.Item
                                    {...(formItemLayout)}
                                    label={index === 0 ? 'Developers' : ''}
                                    required={false}
                                    key={field.key}
                                >
                                    <Form.Item
                                        {...field}
                                        validateTrigger={['onChange', 'onBlur']}
                                        rules={[
                                            {
                                                required: true,
                                                whitespace: true,
                                                message: "Please input developer's name or delete this field.",
                                            },
                                        ]}
                                        noStyle
                                    >
                                        <Input placeholder="Developer's name" style={{ width: '60%' }} />
                                    </Form.Item>

                                    {fields.length > 1 ? (
                                        <MinusCircleOutlined
                                            className="dynamic-delete-button"
                                            onClick={() => remove(field.name)}
                                        />
                                    ) : null}
                                </Form.Item>
                            ))}
                            <Form.Item>
                                <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    style={{ width: '60%' }}
                                    icon={<PlusOutlined />}
                                >
                                    Add Developers
                                </Button>
                                <Form.ErrorList errors={errors} />
                            </Form.Item>
                        </>
                    )}
                </Form.List>
                <Form.Item name="scrumMasterName"
                    label="Scrum Master Name"
                    rules={[
                        {
                            required: true,
                            message: 'Please input the Scrum Master Name!',
                        },
                    ]}
                >
                    <Input type="textarea" />
                </Form.Item>
                <Form.Item name="startDate" label="Start Date" {...config}>
                    <DatePicker />
                </Form.Item>
                <Form.Item name="methodology"
                    label="Methodology"
                    rules={[
                        {
                            required: true,
                            message: 'Please input the Methodology!',
                        },
                    ]}
                    className="collection-create-form_last-form-item">
                    <Radio.Group>
                        <Radio value="Agile">Agile</Radio>
                        <Radio value="Waterfall">Waterfall</Radio>
                    </Radio.Group>
                </Form.Item>
            </Form>
        </Modal >
    );
};


function App() {
    const { FetchUsers, Delete, FindOne, SearchScrumMaster, SearchDeveloper, users, Add, Update, product, setProduct } = useContext(GlobalContext);
    const [query, setQuery] = useState('');
    const [developerQuery, setDeveloperQuery] = useState('');
    const [form, setForm] = useState({});
    const [open, setOpen] = useState(false);
    const url = 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg';

    const onCreate = (values) => {
        values = {
            ...values,
            'startDate': values['startDate'].format('YYYY-MM-DD')
        };

        if (values._id) {
            Update(values, values._id);
        } else {
            const randomId = Math.floor(Math.random() * 1000000);
            values = {
                ...values,
                'productId': randomId
            };
            Add(values, setForm);
        }
        setOpen(false);
        FetchUsers();
    };

    useEffect(() => {
        FetchUsers();
    }, []);
    const SearchScrumMasterHandler = () => {
        SearchScrumMaster(query);
    };

    const SearchDeveloperHandler = () => {
        SearchDeveloper(developerQuery);
    };


    const onchangeScrumHandler = (e) => {
        setQuery(e.target.value);
    };

    const onchangeDeveloperHandler = (e) => {
        setDeveloperQuery(e.target.value);
    };

    const handleEditClick = async (id) => {
        try {
            const res = await axios.get(`https://anmolsingh-api.onrender.com/api/product/monogoid/${id}`);
            setProduct(res.data);
        } catch (err) {
            console.log(err.response.data.error);
        } finally {
            setOpen(true);
        }
    };

    const usersWithKey = users.map(user => ({
        ...user,
        key: user._id
    }));


    const columns = [
        {
            title: '',
            key: 'avatar',
            render: (_, record) => {
                return (
                    <Avatar src={<img src={url} alt="avatar" />} />
                );
            },
        },
        {
            title: 'Product Id',
            dataIndex: 'productId',
            key: 'productId',
        },
        {
            title: 'Product Name',
            dataIndex: 'productName',
            key: 'productName',
        },
        {
            title: 'Product Owner',
            dataIndex: 'productOwnerName',
            key: 'productOwnerName',
        },
        {
            title: 'Developers',
            key: 'developers',
            dataIndex: 'developers',
            render: (_, { developers }) => (
                <>
                    {developers.map((developer) => {
                        let color = developer.length > 5 ? 'geekblue' : 'green';
                        if (developer === 'Anmol Singh') {
                            color = 'volcano';
                        }
                        return (
                            <Tag color={color} key={developer}>
                                {developer.toUpperCase()}
                            </Tag>
                        );
                    })}
                </>
            ),
        },
        {
            title: 'Scrum Master',
            dataIndex: 'scrumMasterName',
            key: 'scrumMasterName',
        },
        {
            title: 'Start Date',
            dataIndex: 'startDate',
            key: 'startDate',
        },
        {
            title: 'Methodology',
            dataIndex: 'methodology',
            key: 'methodology',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <>
                    <Button onClick={() => handleEditClick(record._id)}>Edit</Button>
                    <Popconfirm title="Sure to delete?" onConfirm={() => Delete(record.productId)}>
                        <Button type="primary" danger style={{ marginLeft: '10px' }}>
                            Delete
                        </Button>
                    </Popconfirm>
                </>
            ),
        },
    ];

    return (
        <div className="App">
            <Center h="10vh">
                <Text
                    bgGradient='linear(to-l, #7928CA, #FF0080)'
                    bgClip='text'
                    fontSize='4xl'
                    fontWeight='extrabold'
                >
                    Province of BC Project Management System By Anmol Singh
                </Text>
            </Center>
            <div style={{ textAlign: "center" }}>
                <Typography.Title level={4} style={{ margin: 0 }}>
                    Built with NestJS, React, MongoDB, TypeScript for CRUD Operations
                </Typography.Title>
            </div>
            <Container maxW={'full'} p="4" fontSize={'18px'}>
                <Box rounded="lg" boxShadow="base" p="4">
                    <Box mt="2" gap={'2'} mb="4" display={'flex'}>
                        <FormControl>
                            <Input type="text" onChange={onchangeScrumHandler} />
                        </FormControl>

                        <Button icon={<SearchOutlined />} onClick={() => SearchScrumMasterHandler()}>
                            Search Scrum Master
                        </Button>
                    </Box>
                    <Box mt="2" gap={'2'} mb="4" display={'flex'}>
                        <FormControl>
                            <Input type="text" onChange={onchangeDeveloperHandler} />
                        </FormControl>

                        <Button icon={<SearchOutlined />} onClick={() => SearchDeveloperHandler()}>
                            Search Developer
                        </Button>
                    </Box>
                </Box>
                <Box mt="5" rounded={'lg'} boxShadow="base">
                    <Box p="4" display={'flex'} justifyContent="space-between">
                        <Typography.Title level={5} style={{ margin: 0 }}>
                            Total {users.length}
                        </Typography.Title>

                        <div>
                            <Button
                                type="primary"
                                onClick={() => {
                                    setOpen(true);
                                }}
                                icon={<PlusOutlined />}
                            >
                                New Project
                            </Button>
                            <CollectionCreateForm
                                open={open}
                                onCreate={onCreate}
                                onCancel={() => {
                                    setOpen(false);
                                }}
                                product={product}
                                setProduct={setProduct}
                            />
                        </div>
                    </Box>
                    <Table columns={columns} dataSource={usersWithKey} />
                </Box>
                <DrawerExample />
            </Container>
            <div style={{ textAlign: "center" }}>
                <Typography.Title level={4} style={{ margin: 0 }}>
                    Source code available at&nbsp;
                    <a href="https://github.com/anmolsinghturka/Anmol-Singh-IS24-full-stack-competition-req97073" target="_blank" rel="noopener noreferrer">
                        <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub Logo" style={{ display: "inline-block", verticalAlign: "middle", width: "40px" }} />
                    </a>
                    &nbsp;Backend API Swagger Documentation at https://anmolsingh-api.onrender.com/api/api-docs &nbsp;
                </Typography.Title>
            </div>
        </div >
    );
}

export default App;













