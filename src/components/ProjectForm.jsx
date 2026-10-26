import { useState } from 'react';
import { useProjects } from '../context/ProjectsContext';

const initialFormData = {
  title: '',
  description: '',
  category: 'web',
  imageUrl: 'https://placehold.co/600x400?text=New+Project',
  technologies: []
};

const ProjectForm = () => {
  const { addProject } = useProjects();

  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.title.trim() === '') {
      setError('Title is required');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await addProject(formData);
      setFormData(initialFormData);
    } catch (err) {
      setError(err.message || 'Failed to add project');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="project-form" onSubmit={handleSubmit}>
      <h3>Add a Project</h3>

      <div className="form-group">
        <label htmlFor="project-title">Title</label>
        <input
          type="text"
          id="project-title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          disabled={isSubmitting}
        />
      </div>

      <div className="form-group">
        <label htmlFor="project-description">Description</label>
        <input
          type="text"
          id="project-description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          disabled={isSubmitting}
        />
      </div>

      <div className="form-group">
        <label htmlFor="project-category">Category</label>
        <select
          id="project-category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          disabled={isSubmitting}
        >
          <option value="web">Web</option>
          <option value="mobile">Mobile</option>
          <option value="data">Data</option>
        </select>
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Adding...' : 'Add Project'}
      </button>

      {error && (
        <div className="form-group">
          <span className="error-message">{error}</span>
        </div>
      )}
    </form>
  );
};

export default ProjectForm;
