import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useDisclosure, useToast } from '@chakra-ui/react';
export const GlobalContext = createContext();

export default function Wrapper({ children }) {
    const [users, setUsers] = useState([]);
    const [product, setProduct] = useState({});
    const [errors, setErrors] = useState({});
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    useEffect(() => {
    }, [product]);

    const FetchUsers = () => {
        axios
            .get('https://anmolsingh-api.onrender.com/api/product')
            .then((res) => {
                setUsers(res.data);
            })
            .catch((err) => {
                console.log(err.reponse.data);
            });
    };

    const SearchScrumMaster = (query) => {
        axios
            .post(`https://anmolsingh-api.onrender.com/api/product/searchscrummaster?key=${query}`)
            .then((res) => {
                setUsers(res.data);
            })
            .catch((err) => {
                console.log(err.reponse.data);
            });
    };

    const SearchDeveloper = (query) => {
        axios
            .post(`https://anmolsingh-api.onrender.com/api/product/searchdeveloper?name=${query}`)
            .then((res) => {
                setUsers(res.data);
            })
            .catch((err) => {
                console.log(err.reponse.data);
            });
    };

    const Delete = (productId) => {
        axios
            .delete(`https://anmolsingh-api.onrender.com/api/product/${productId}`)
            .then((res) => {
                setUsers(users.filter((u) => u.productId !== productId));
                toast({
                    title: 'User Deleted',
                    status: 'success',
                    duration: 4000,
                    isClosable: true,
                });
            })
            .catch((err) => {
                console.log(err.reponse.data);
            });
    };

    const Add = (form, setForm) => {
        axios
            .post('https://anmolsingh-api.onrender.com/api/product', form)
            .then((res) => {
                setUsers([...users, res.data]);
                toast({
                    title: 'Project Added',
                    status: 'success',
                    duration: 4000,
                    isClosable: true,
                });
                setErrors({});
                setForm({});
                onClose();
            })
            .catch((err) => {
                setErrors(err.response.data.error);
            });
    };

    const FindOne = async (id) => {
        await axios
            .get(`https://anmolsingh-api.onrender.com/api/product/monogoid/${id}`)
            .then((res) => {
                if (res.data) {
                    setProduct(res.data);
                }
            })
            .catch((err) => {
                setErrors(err.response.data.error);
            });
    };

    const Update = (form, id) => {
        axios
            .put(`https://anmolsingh-api.onrender.com/api/product/${id}`, form)
            .then((res) => {
                toast({
                    title: 'User Updated',
                    status: 'success',
                    duration: 4000,
                    isClosable: true,
                });
                setErrors({});
                FetchUsers();
            })
            .catch((err) => {
                setErrors(err.response.data.error);
            });
    };

    return (
        <GlobalContext.Provider
            value={{
                FetchUsers,
                SearchScrumMaster,
                SearchDeveloper,
                Delete,
                Add,
                FindOne,
                Update,
                users,
                onOpen,
                isOpen,
                onClose,
                errors,
                setErrors,
                product,
                setProduct,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
}
