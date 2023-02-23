import { useEffect, useState } from 'react';
import BasketList1 from '../../Components/Basket/BasketList1';
import BooksList1 from '../../Components/Basket/BooksList1';
import { getBooks } from '../../services/functions';
import Search from '../../Components/Basket/Search';


const UserProfile = () => {
    const [books, setBooks] = useState([]);
    const [order, setOrder] = useState([]);
    const [search, setSearch] = useState('');
    const [products, setProducts] = useState(books);


    const getAllbooks = async () =>{
        const booksData = await getBooks();
        setBooks(booksData);
    }
    
    useEffect(() => {
        getAllbooks();
    }, []);

    const handleChange = (e) => {
        if (!e.target.value) {
            setProducts(books);
            setSearch('');
            return;
        }

        setSearch(e.target.value);
        setProducts(
            products.filter((book) =>
                book.titulo.toLowerCase().includes(e.target.value.toLowerCase())
            ))
    };

    const addToOrder = (booksItem) => {
        let quantity = 1;

        const indexInOrder = order.findIndex(
            (item) => item.id === booksItem.id
        );

        if (indexInOrder > -1) {
            quantity = order[indexInOrder].quantity + 1;

            setOrder(
                order.map((item) => {
                    if (item.id !== booksItem.id) return item;

                    return {
                        id: item.id,
                        titulo: item.titulo,
                        autores: item.autores,
                        isbn: item.isbn,
                        donación: item.donación,
                        imagen: item.imagen,
                        quantity,
                    };
                })
            );
        } else {
            setOrder([
                ...order,
                {
                    id: booksItem.id,
                    titulo: booksItem.titulo,
                    autores: booksItem.autores,
                    isbn: booksItem.isbn,
                    donación: booksItem.donación,
                    imagen: booksItem.imagen,
                    quantity,
                },
            ]);
        }
    };
    
    const removeFromOrder = (booksItem) => {
        setOrder(order.filter((item) => item.id !== booksItem));
    };

    
    return (
        <div className='App'>
            <div className='container'>
                <BasketList1 order={order} setOrder={removeFromOrder} />
                <BooksList1 books={books} setOrder={addToOrder} />
                <Search value={search} onChange={handleChange} />
            </div>
        </div>
    );
};

export default UserProfile;
