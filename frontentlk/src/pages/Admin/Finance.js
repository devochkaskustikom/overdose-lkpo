import {
    Box,
    Link,
    Heading,
    Container,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    TableContainer,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    useToast,
    Input,
    FormControl,
    FormLabel,
    Tooltip,
    Tag,
    Td,
    Spinner,
    Center,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import apiUrl from '../../config/apiUrl'
import getToken from '../../config/getToken'
import { useForm } from "react-hook-form";
import React from 'react';

function Reports() {
    const [reports, setReports] = useState([])
    const [edit_id, setEditID] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);

    const get_users = async () => {
        const data = await axios.get(`${apiUrl()}/admin/get_reports`, {
            headers: {
              'authorization': `Bearer ${getToken()}`
            }
        })

        setReports(data.data.reports)
        setLoaded(true)
    }

    const CustomCard = React.forwardRef(({ children, ...rest }, ref) => (
        <Box p='1'>
          <Tag ref={ref} {...rest}>
            {children}
          </Tag>
        </Box>
      ))

    useEffect(() => {
        if(!loaded) {
            get_users()
        }
    }, [])

    const toast = useToast()
    const { register, handleSubmit } = useForm();
    const { isOpen, onOpen, onClose } = useDisclosure()

    const reject_report = async (raw) => {
        setIsLoading(true)
        try {
            let data = raw

            Object.assign(data, {id: edit_id});

            const {data: response} = await axios.post(`${apiUrl()}/admin/reject_report`, data, {
                headers: {
                    'authorization': `Bearer ${getToken()}`
                }
            })

            if(response.error) {
                toast({
                    title: `Произошла ошибка!`,
                    description: response.error,
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                })
            } else {
                toast({
                    title: `Выплата отменена!`,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                })
            }
        } catch(e) {
            toast({
                title: `Произошла ошибка!`,
                description: e,
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
        }
        onClose()
        get_users()
        setIsLoading(false)
    }
    const accept_report = async (id) => {
        setIsLoading(true)
        try {
            let data = {id: id}

            const {data: response} = await axios.post(`${apiUrl()}/admin/accept_report`, data, {
                headers: {
                    'authorization': `Bearer ${getToken()}`
                }
            })

            if(response.error) {
                toast({
                    title: `Произошла ошибка!`,
                    description: response.error,
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                })
            } else {
                toast({
                    title: `Выплата принята!`,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                })
            }
        } catch(e) {
            toast({
                title: `Произошла ошибка!`,
                description: e,
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
        }
        onClose()
        get_users()
        setIsLoading(false)
    }

    return (
        <Box alignItems='center' textAlign='center'>
            <Heading fontWeight='bold' size='2xl'>Выплаты</Heading>
            <Container maxW='container.xl' alignContent='center' alignItems='center'>
            <TableContainer mt='20px'>
                <Table>
                    <Thead>
                        <Tr>
                            <Th>#</Th>
                            <Th>Сумма</Th>
                            <Th>Номер карты</Th>
                            <Th>Статус</Th>
                            <Th></Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {reports.map((report) => {
                            return (
                                <Tr>
                                    <Td>{report.id}</Td>
                                    <Td>{report.sum}</Td>
                                    <Td>{report.card_number}</Td>
                                    <Td>{report.status === 'ok' && (
                                        <Tooltip label='Принят'>
                                            <CustomCard><i className="bi bi-check-circle-fill" /></CustomCard>
                                        </Tooltip>
                                    ) || report.status === 'progress' && (
                                        <Tooltip label='В процессе'>
                                            <CustomCard><i className="bi bi-clock" /></CustomCard>
                                        </Tooltip>
                                    ) || report.status === 'error' && (
                                        <Tooltip label='Ошибка'>
                                            <CustomCard><i className="bi bi-patch-exclamation-fill" /></CustomCard>
                                        </Tooltip>
                                    )}</Td>
                                    <Td>
                                        {report.status === 'progress' && (
                                            <Box>
                                                {!isLoading && (
                                                    <Box><Link _hover={{ color: 'red' }} _active={{ boxShadow: 'none!important', color: 'red' }} _focus={{ boxShadow: 'none!important', color: 'red' }} onClick={() => {
                                                        setEditID(report.id)
                                                        accept_report(report.id)
                                                    }}><i className="bi bi-check-lg" /> Принять</Link>, <Link _hover={{ color: 'red' }} _active={{ boxShadow: 'none!important', color: 'red' }} _focus={{ boxShadow: 'none!important', color: 'red' }} onClick={() => {
                                                        setEditID(report.id)
                                                        onOpen()
                                                    }}><i className="bi bi-patch-exclamation" /> Отклонить</Link></Box>
                                                )}
                                                {isLoading && (
                                                    <Spinner color='red' />
                                                )}
                                            </Box>
                                        )}
                                    </Td>
                                </Tr>
                            )
                        })}
                    </Tbody>
                </Table>
            </TableContainer>
            {!loaded && (
                <Center mt='20px'><Spinner color='red' size='xl' /></Center>
            )}
            </Container>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Отмена вывода</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <form onSubmit={handleSubmit(reject_report)}>
                        <FormControl>
                            <FormLabel htmlFor='reason'>* Причина</FormLabel>
                            <Input id='reason' placeholder='Причина' isRequired type='text' {...register('reason')} />
                        </FormControl>
                        
                        <Button mt='10px' w='100%' color='red' border='1px' bgColor='white' borderColor='red' _hover={{ color: 'white', bgColor: 'red' }} _focus={{ boxShadow: 'none!important', color: 'white', bgColor: 'red' }} _active={{ boxShadow: 'none!important', color: 'white', bgColor: 'red' }} type='submit' isLoading={isLoading}>
                            Отменить
                        </Button>
                    </form>
                </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    )
}

export default Reports;