// import Database from 'better-sqlite3';
// import path from 'path';
// import { json } from '@sveltejs/kit';
// import { redirect } from '@sveltejs/kit';

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
//             SELECT trip_id, seat_id, seat_type, coach_id, substr((class_1),1,1) as class, count(seat_id) as available_seats, price,
//             s.station_name AS 'start', s2.station_name AS 'end', s.station_id 'start_id', s2.station_id 'end_id'
//             FROM SEAT
//             JOIN PAX_COACHES USING (coach_id)
//             JOIN TRAINS USING (train_id)
//             join SEAT_TYPE USING (seat_type)
//             join TRIPS t using (trip_id) 
//             JOIN STATIONS s ON t.start_station_id = s.station_id
//             JOIN STATIONS s2 ON s2.station_id = t.end_station_id
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
import Database from 'better-sqlite3';
import path from 'path';

export async function load({ url }) {
  const dbPath = path.resolve('src/database/dbforTrain.db');
  const db = new Database(dbPath);

  try {
    // Extract selectedTripId, origin, destination, and date from query parameters
    const selectedTripId = url.searchParams.get('selectedTripId');
    const origin = url.searchParams.get('origin');
    const destination = url.searchParams.get('destination');
    const date = url.searchParams.get('date');
    let start_id = url.searchParams.get('start_id');
    let end_id = url.searchParams.get('end_id');

    // Step 1: Fetch station data
    const stationsQuery = `
      SELECT station_id, station_name
      FROM STATIONS
      ;
    `;
    const stations = db.prepare(stationsQuery).all();

    // Adjust start and end stations if necessary
    if (start_id > end_id) {
      [start_id, end_id] = [end_id, start_id];
    }

    // Step 2: Fetch stations between start_id and end_id
    const stationsQ = db.prepare(`
      SELECT station_id, station_name
      FROM STATIONS
      WHERE station_id BETWEEN ? AND ?;
    `).all(start_id, end_id);

    // Step 3: Fetch trip data if origin, destination, and date are provided
    let tripsWithDetails = [];
    if (origin && destination && date) {
      const tripsQuery = `
        SELECT 
          t.trip_id,
          CONCAT(UPPER(SUBSTRING(t.trip_id, 4, 2)), SUBSTRING(t.trip_id, 7)) AS trip_name,
          s1.station_name AS start_name, 
          s2.station_name AS end_name,
          t.from_datetime
        FROM TRIPS t 
        JOIN STATIONS s1 ON t.start_station_id = s1.station_id 
        JOIN STATIONS s2 ON t.end_station_id = s2.station_id 
        WHERE DATE(t.from_datetime) = ?
          AND t.start_station_id = ?
          AND t.end_station_id = ?
        ORDER BY t.from_datetime;
      `;
      tripsWithDetails = db.prepare(tripsQuery).all(date, origin, destination);
    }

    // Step 4: If selectedTripId is provided, fetch specific trip details
    let tripsQ = [];
    const tripDetailsQuery = `
        SELECT trip_id, seat_type, count(seat_id)
        FROM SEAT
        JOIN PAX_COACHES USING (coach_id)
        JOIN TRAINS USING (train_id)
        WHERE seat_id NOT IN (SELECT reserved_seat_id FROM RESERVATIONS)
        and trip_id = ?
        GROUP BY trip_id, seat_type;
      `;
      tripsQ = db.prepare(tripDetailsQuery).all(selectedTripId);

    // Step 5: Fetch additional trip data
    const trips = db.prepare(`
      SELECT t.trip_id, t.staff_id, t.start_station_id, t.end_station_id, t.route, t.from_datetime, 
      s.station_name AS 'start', s2.station_name AS 'end', s.station_id 'start_id', s2.station_id 'end_id'
      FROM TRIPS t
      JOIN STATIONS s ON t.start_station_id = s.station_id
      JOIN STATIONS s2 ON s2.station_id = t.end_station_id;
    `).all();
        // Return the gathered data as plain object (no JSON.stringify needed)
    console.log(tripsQ)

    return {
      trips,
      stations,
      tripsWithDetails,
      stationsQ,
      tripsQ, // Add fetched trip details
      start_id,
      end_id,
      success: true,
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      error: 'Unable to fetch data from the database',
      success: false,
    };
  } finally {
    db.close();
  }
}
