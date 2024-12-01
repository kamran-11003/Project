export interface Ride {
    name: string;
    image: string;
    price?: number;
    duration?: number;
  }
  
  export const rides: Ride[] = [
    {
      name: 'Ride AC',
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=300&h=300',
      price: 25,
      duration: 30
    },
    {
      name: 'Ride Mini',
      image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=300&h=300',
      price: 15,
      duration: 35
    },
    {
      name: 'Motoride',
      image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=300&h=300',
      price: 10,
      duration: 25
    },
    {
      name: 'Horse',
      image: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&q=80&w=300&h=300',
      price: 50,
      duration: 45
    },
    {
      name: 'Spiderman',
      image: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&q=80&w=300&h=300',
      price: 100,
      duration: 15
    },
    {
      name: 'Superman',
      image: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&q=80&w=300&h=300',
      price: 150,
      duration: 10
    }
  ];