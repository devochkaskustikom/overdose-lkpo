import { useState, useEffect } from 'react';
import axios from 'axios';
import apiUrl from '../../config/apiUrl'
import getToken from '../../config/getToken'
import {
    Box,
    Heading,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    TableContainer,
    useToast,
    Container,
    Spinner,
    Center,
} from '@chakra-ui/react'

export default function Cover(props) {
    const [link, setLink] = useState();
    const [views, setStats] = useState();
    const [viewsAll, setViews] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const toast = useToast()
    const getlink = async () => {
        const data = await axios.get(`${apiUrl()}/user/get_link_by_id?id=${props.id}`, {
            headers: {
              'authorization': `Bearer ${getToken()}`
            }
        })
        if(data.data.error) {
            toast({
                title: `Произошла ошибка!`,
                description: `${data.data.error}`,
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
        } else {
            setLink(data.data.link)
            let viewsArray = []
            let viewsJson = {}
            let viewsUnknown = {}
            data.data.views.forEach(view => {
                if(view.country != 'unknown') {
                    if(`${view.country}` in viewsJson) {
                        viewsJson[`${view.country}`] = viewsJson[`${view.country}`] + 1
                    } else {
                        viewsJson[`${view.country}`] = 1
                    }
                } else {
                    if(`${view.country}` in viewsUnknown) {
                        viewsUnknown[`${view.country}`] = viewsUnknown[`${view.country}`] + 1
                    } else {
                        viewsUnknown[`${view.country}`] = 1
                    }
                }
            });



            viewsArray = Object.entries(viewsJson)
            
            
            
            setStats(viewsArray)
            if(viewsUnknown.unknown) {
                setViews(data.data.all_views - viewsUnknown.unknown)
            } else {
                setViews(data.data.all_views)
            }
            setLoaded(true)
        }
    }

    useEffect(() => {
        if(!loaded) {    
            getlink()
        }
    }, [])
    return (
        <Box>
            {!loaded && (
                <Center><Spinner color='red' size='xl' /></Center>
            ) || (
                <Box>
                    <Heading>Аналитика</Heading>
                    <Heading size='md'>Всего: {viewsAll}</Heading>
                    <Box mt='10px' borderWidth='1px' borderRadius='lg' bgColor='white'>
                        <TableContainer>
                            <Table variant='simple'>
                                <Thead>
                                    <Tr>
                                        <Th>Страна</Th>
                                        <Th isNumeric>Количество переходов</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {console.log(views)}
                                    {views.map((view) => {
                                        return (
                                            <Tr>
                                                <Th>{view[0]}</Th>
                                                <Th isNumeric>{view[1]}</Th>
                                            </Tr>
                                        )
                                    })}
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Box>
            )}
        </Box>
    )
}