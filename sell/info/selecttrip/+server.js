// import Database from 'better-sqlite3';
// import path from 'path';
// import { json } from '@sveltejs/kit';

// // Function to handle POST request from frontend and query trip details
// export async function POST({ request }) {
//     const dbPath = path.resolve('src/database/dbforTrain.db'); // Ensure this path is correct
//     const db = new Database(dbPath);

//     try {
//         const { tripId } = await request.json();

//         if (!tripId) {
//             return json({ success: false, message: 'Trip ID is required' }, { status: 400 });
//         }

//         // Query the database to get the trip details based on the selected trip_id
//         const tripDetailsQuery = `
//             SELECT trip_id, seat_type, count(seat_id) as available_seats
//             FROM SEAT
//             JOIN PAX_COACHES USING (coach_id)
//             JOIN TRAINS USING (train_id)
//             WHERE seat_id NOT IN (SELECT reserved_seat_id FROM RESERVATIONS)
//             AND trip_id = ?
//             GROUP BY trip_id, seat_type;
//         `;
//         const tripsQ = db.prepare(tripDetailsQuery).all(tripId);

//         console.log('Received trip ID:', tripId);
//         console.log('Queried trip details:', tripsQ);

//         // Return the queried trip details back to the frontend
//         return json({ success: true, tripsQ });
//     } catch (error) {
//         console.error('Error processing request:', error);
//         return json({ success: false, message: 'Failed to retrieve trip details' }, { status: 500 });
//     } finally {
//         db.close();
//     }
// }
