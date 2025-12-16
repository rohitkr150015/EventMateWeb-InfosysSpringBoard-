import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { adminAPI, eventAPI } from '../api/api';

const EventManagement = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        eventDate: '',
        location: '',
        imageUrl: '',
        price: '',
    });

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        try {
            setLoading(true);
            const response = await eventAPI.getAllEvents();
            setEvents(response.data);
        } catch (err) {
            toast.error('Failed to load events');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingEvent) {
                await adminAPI.updateEvent(editingEvent.id, formData);
                toast.success('Event updated successfully!');
            } else {
                await adminAPI.createEvent(formData);
                toast.success('Event created successfully!');
            }

            setShowModal(false);
            resetForm();
            loadEvents();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Operation failed');
        }
    };

    const handleEdit = (event) => {
        setEditingEvent(event);
        setFormData({
            title: event.title,
            description: event.description,
            eventDate: event.eventDate,
            location: event.location,
            imageUrl: event.imageUrl || '',
            price: event.price || '',
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this event?')) return;

        try {
            await adminAPI.deleteEvent(id);
            toast.success('Event deleted successfully!');
            loadEvents();
        } catch {
            toast.error('Failed to delete event');
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            eventDate: '',
            location: '',
            imageUrl: '',
            price: '',
        });
        setEditingEvent(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Event Management</h2>
                <button
                    onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}
                    className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                    + Add New Event
                </button>
            </div>

            {/* Loader */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Title
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Price
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Actions
                                </th>
                            </tr>
                            </thead>

                            <tbody className="bg-white divide-y divide-gray-200">
                            {events.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="px-6 py-12 text-center text-gray-500">
                                        No events yet
                                    </td>
                                </tr>
                            ) : (
                                events.map((event) => (
                                    <tr key={event.id}>
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {event.title}
                                        </td>

                                        <td className="px-6 py-4 text-sm font-semibold">
                                            ₹
                                            {event.price
                                                ? parseFloat(event.price).toLocaleString('en-IN')
                                                : '0'}
                                        </td>

                                        <td className="px-6 py-4 text-sm">
                                            <button
                                                onClick={() => handleEdit(event)}
                                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(event.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-6">
                            {editingEvent ? 'Edit Event' : 'Add New Event'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text"
                                name="title"
                                placeholder="Event Title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border rounded-lg"
                            />

                            <textarea
                                name="description"
                                placeholder="Description"
                                rows="4"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border rounded-lg resize-none"
                            />

                            <input
                                type="date"
                                name="eventDate"
                                value={formData.eventDate}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border rounded-lg"
                            />

                            {/*<input*/}
                            {/*    type="text"*/}
                            {/*    name="location"*/}
                            {/*    placeholder="Location"*/}
                            {/*    value={formData.location}*/}
                            {/*    onChange={handleChange}*/}
                            {/*    className="w-full px-4 py-3 border rounded-lg"*/}
                            {/*/>*/}

                            <input
                                type="url"
                                name="imageUrl"
                                placeholder="Image URL"
                                value={formData.imageUrl}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border rounded-lg"
                            />

                            <input
                                type="number"
                                name="price"
                                placeholder="Price (₹)"
                                value={formData.price}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                required
                                className="w-full px-4 py-3 border rounded-lg"
                            />

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        resetForm();
                                    }}
                                    className="flex-1 bg-gray-200 py-2 rounded-lg"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="flex-1 bg-primary text-white py-2 rounded-lg"
                                >
                                    {editingEvent ? 'Update Event' : 'Create Event'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventManagement;
