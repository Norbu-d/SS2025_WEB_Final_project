import { useState, useRef, useCallback } from 'react';
import { X, ArrowLeft } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface CreatePostModalProps {
  onClose: () => void;
}

type Step = 'upload' | 'crop' | 'details' | 'sharing';

export function CreatePostModal({ onClose }: CreatePostModalProps) {
  const [currentStep, setCurrentStep] = useState<Step>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const createPostMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to create post');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['explore-posts'] });
      onClose();
    },
    onError: (error) => {
      console.error('Error creating post:', error);
      alert(error.message || 'Failed to create post');
    },
  });

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }

      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
        setCurrentStep('crop');
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    
    if (file) {
      // Create a fake input event to reuse the same validation logic
      const fakeEvent = {
        target: { files: [file] }
      } as React.ChangeEvent<HTMLInputElement>;
      handleFileSelect(fakeEvent);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert('Please select an image');
      return;
    }

    if (!caption.trim()) {
      alert('Please add a caption');
      return;
    }

    setIsSubmitting(true);
    setCurrentStep('sharing');
    
    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('caption', caption.trim());

    try {
      await createPostMutation.mutateAsync(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'upload': return 'Create new post';
      case 'crop': return 'Crop';
      case 'details': return 'Create new post';
      case 'sharing': return 'Sharing';
      default: return 'Create new post';
    }
  };

  const handleNext = () => {
    switch (currentStep) {
      case 'crop':
        setCurrentStep('details');
        break;
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'crop':
        setCurrentStep('upload');
        setSelectedFile(null);
        setPreview(null);
        break;
      case 'details':
        setCurrentStep('crop');
        break;
      case 'sharing':
        setCurrentStep('details');
        break;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl overflow-hidden w-[600px] h-[700px] mx-4 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-4">
            {currentStep !== 'upload' && currentStep !== 'sharing' && (
              <button
                onClick={handleBack}
                className="p-1 hover:bg-gray-100 rounded-full text-black"
                disabled={isSubmitting}
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
            <h2 className="text-lg font-semibold text-black">{getStepTitle()}</h2>
          </div>
          
          <div className="flex items-center gap-2">
            {currentStep === 'crop' && (
              <button
                onClick={handleNext}
                className="px-4 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm font-medium"
              >
                Next
              </button>
            )}
            
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full text-black"
              disabled={isSubmitting}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex">
          {currentStep === 'upload' && (
            <div className="flex-1 bg-gray-700 flex flex-col items-center justify-center p-8">
              <div
                className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-600 transition-colors rounded-lg"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="text-center">
                  <div className="mb-6">
                    <div className="flex items-center justify-center gap-2">
                      {/* Image icon */}
                      <svg width="64" height="64" className="text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="9" cy="9" r="2"/>
                        <path d="M21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                      </svg>
                      {/* Video icon */}
                      <svg width="64" height="64" className="text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <polygon points="23 7 16 12 23 17 23 7"/>
                        <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-light text-white mb-6">Drag photos and videos here</h3>
                  <button className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors font-medium">
                    Select from computer
                  </button>
                </div>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          )}

          {(currentStep === 'crop' || currentStep === 'details') && preview && (
            <div className="flex flex-1">
              {/* Image Preview */}
              <div className="flex-1 bg-black flex items-center justify-center">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              {/* Details Panel */}
              {currentStep === 'details' && (
                <div className="w-80 border-l border-gray-200 flex flex-col">
                  <div className="flex-1 p-4">
                    <textarea
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      placeholder="Write a caption..."
                      className="w-full h-32 resize-none border border-gray-300 rounded-md p-3 outline-none text-sm focus:border-blue-500 text-gray-900 placeholder-gray-500"
                      maxLength={2200}
                      disabled={isSubmitting}
                    />
                    <div className="text-xs text-gray-400 text-right mt-1">
                      {caption.length}/2,200
                    </div>
                  </div>

                  <div className="p-4 border-t border-gray-200">
                    <button
                      onClick={handleSubmit}
                      disabled={!caption.trim() || isSubmitting}
                      className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                      {isSubmitting ? 'Sharing...' : 'Share'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 'sharing' && (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <h3 className="text-lg font-medium mb-2">
                  {isSubmitting ? 'Sharing post...' : 'Post shared!'}
                </h3>
                <p className="text-gray-600">
                  {isSubmitting ? 'Please wait while we upload your post.' : 'Your post has been shared successfully.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}