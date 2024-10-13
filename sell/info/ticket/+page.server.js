import { redirect } from '@sveltejs/kit';
import Database from 'better-sqlite3';
import path from 'path';

export const load = async ({ url }) => {
  const trip_id = url.searchParams.get('tripNumber');
  const start_id = url.searchParams.get('from_id');
  const end_id = url.searchParams.get('to_id');

  // Make sure the database path is correctly set relative to the project structure
  const dbPath = 'src/database/dbforTrain.db';  
  const db = new Database(dbPath);
  
  console.log('Received Params:', trip_id, start_id, end_id); // Log for debugging
  
  try {
    // SQL query to insert data into the RESERVATIONS table
    const query = `
      INSERT INTO RESERVATIONS (
        reserved_seat_id, 
        reserve_trip_id, 
        passenger_id, 
        booking_datetime, 
        from_station_id, 
        to_station_id, 
        reserve_status, 
        payment_id
      ) VALUES ('S020', ?, 'P0000020', datetime('now'), ?, ?, 'wait', '10020')
    `;
    
    // Prepare and execute the SQL query
    const insertReservation = db.prepare(query);
    insertReservation.run(trip_id, start_id, end_id);

    // Close the database connection after the query execution
    db.close();

    // Return success response
    return {
      success: true
    };
  } catch (error) {
    console.error('Error issuing ticket:', error);

    // Close the database if an error occurs
    db.close();

    // Return failure response with error details
    return {
      success: false,
      error: 'Failed to issue ticket'
    };
  }
};
