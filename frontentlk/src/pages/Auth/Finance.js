import {
    Box,
    Link,
    Heading,
    Container,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Tooltip,
    Tag,
    useToast,
    Button,
    FormControl,
    FormLabel,
    FormHelperText,
    Input,
    Text,
    Spinner,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import apiUrl from '../../config/apiUrl'
import getToken from '../../config/getToken'
import React from 'react';
import { useForm } from "react-hook-form";

export default function Main() {
    const [balance, setBalance] = useState(0);
    const [dollar, setDollar] = useState(0);
    const [reports, setReports] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { isOpen, onOpen, onClose } = useDisclosure()

    const toast = useToast()

    const r_to_d = async (bal) => {
        try {
            const {data: data} = await axios.get('https://www.cbr-xml-daily.ru/latest.js')

            let course = data.rates.USD

            setDollar(Math.round(course * bal))
        } catch(e) {
            toast({
                title: 'При конвертации валют произошла ошибка.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
        }
    }

    const CustomCard = React.forwardRef(({ children, ...rest }, ref) => (
        <Box p='1'>
          <Tag ref={ref} {...rest}>
            {children}
          </Tag>
        </Box>
      ))
    const getReports = async () => {
        const data = await axios.get(`${apiUrl()}/user/get_reports`, {
            headers: {
              'authorization': `Bearer ${getToken()}`
            }
        })

        if(data.data.reports.length === 0) {
            setReports(null)
        } else {
            setReports(data.data.reports)
        }
    }
    useEffect(() => {
        const getReports = async () => {
            const data = await axios.get(`${apiUrl()}/user/get_reports`, {
                headers: {
                  'authorization': `Bearer ${getToken()}`
                }
            })
  
            if(data.data.reports.length === 0) {
                setReports(null)
                setLoaded(true);
            } else {
                setReports(data.data.reports)
                setLoaded(true);
            }
        }
        const loading = async () => {
            const data = await axios.get(`${apiUrl()}/user/profile_info`, {
                headers: {
                  'authorization': `Bearer ${getToken()}`
                }
            })
  
            setBalance(data.data.user.balance)
            r_to_d(data.data.user.balance)
            getReports()
        }
        if(!loaded) {    
            loading()
        }
    }, []);

    const { register, handleSubmit } = useForm();

    const onSubmit = async (data) => {
        setIsLoading(true)
        try {
            const response = await axios.post(`${apiUrl()}/user/new_report`, data, {
                headers: {
                  'authorization': `Bearer ${getToken()}`
                }
            })

            document.getElementById('card').value = ''
            if(response.data.error) {
                onClose()
                toast({
                    title: 'Произошла ошибка!',
                    description: 'Для вывода, ваш баланс должен быть больше 1000 рублей.',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                })
            } else {
                onClose()
                getReports()
                toast({
                    title: 'Запрос создан!',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                })
            }
        } catch(e) {
            document.getElementById('card').value = ''
            toast({
                title: `Произошла ошибка!`,
                description: e,
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
        }
        setIsLoading(false)
    }

    return (
        <Box>
            <Box m='40px' borderWidth='1px' borderRadius='lg' bgColor='white'>
                <Box m='40px'>
                    {loaded && (
                        <Box>
                            <Heading>Доступная сумма: {balance}₽</Heading>
                            <Text fontSize='xl'>${dollar}</Text>
                            <Link mt='10px' _hover={{ color: 'red' }} _active={{ boxShadow: 'none!important', color: 'red' }} _focus={{ boxShadow: 'none!important', color: 'red' }} onClick={onOpen} fontSize='lg'>Запросить выплату</Link>
                        </Box>
                    ) || (
                        <Spinner color='red' size='xl' />
                    )}
                </Box>
            </Box>
            <Container textAlign='center' alignItems='center'>
                <Heading mb='20px'>Запросы на вывод</Heading>
                {!loaded && (
                    <Spinner color='red' size='xl' />
                )}
                {loaded && (
                    <Box>
                        {!reports && (
                            <Heading size='lg'>Запросов не найдено</Heading>
                        )}
                    </Box>
                )}
                {reports && (
                    <TableContainer>
                        <Table variant='simple'>
                            <Thead>
                                <Tr>
                                    <Th>Статус</Th>
                                    <Th>Сумма</Th>
                                    <Th>Номер карты</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {reports.map((report) => {
                                    return (
                                        <Tr>
                                            {report.status === 'ok' && (
                                                <Td><Tooltip label='Принят'>
                                                    <CustomCard><i className="bi bi-check-circle-fill" /></CustomCard>
                                                </Tooltip></Td>
                                            )}
                                            {report.status === 'progress' && (
                                                <Td><Tooltip label='В процессе'>
                                                    <CustomCard><i className="bi bi-clock" /></CustomCard>
                                                </Tooltip></Td>
                                            )}
                                            {report.status === 'error' && (
                                                <Td><Tooltip label='Ошибка'>
                                                    <CustomCard><i className="bi bi-patch-exclamation-fill" /></CustomCard>
                                                </Tooltip></Td>
                                            )}
                                            <Td>{report.sum}₽</Td>
                                            <Td>{report.card_number}</Td>
                                        </Tr>
                                    )
                                })}
                            </Tbody>
                        </Table>
                    </TableContainer>
                )}
            </Container>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                <ModalHeader>Вывод средств</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <FormControl mb='10px'>
                            <FormLabel htmlFor='card'>Номер карты</FormLabel>
                            <Input id='card' type='text' required='required' {...register('card_number')} />
                            <FormHelperText>Поддерживаются только банковские карты РФ.</FormHelperText>
                        </FormControl>
                        <Button w='100%' color='red' border='1px' bgColor='white' borderColor='red' _hover={{ color: 'white', bgColor: 'red' }} _focus={{ boxShadow: 'none!important', color: 'white', bgColor: 'red' }} _active={{ boxShadow: 'none!important', color: 'white', bgColor: 'red' }} type='submit' isLoading={isLoading}>
                            Отправить
                        </Button>
                    </form>
                </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    )
}