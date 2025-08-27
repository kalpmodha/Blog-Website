import { useState, useEffect, useRef, useMemo } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
    ClassicEditor,
    Autoformat,
    AutoImage,
    Autosave,
    BalloonToolbar,
    BlockQuote,
    BlockToolbar,
    Bold,
    CloudServices,
    Essentials,
    FindAndReplace,
    FullPage,
    GeneralHtmlSupport,
    Heading,
    HtmlComment,
    HtmlEmbed,
    ImageBlock,
    ImageCaption,
    ImageInline,
    ImageInsert,
    ImageInsertViaUrl,
    ImageResize,
    ImageStyle,
    ImageTextAlternative,
    ImageToolbar,
    ImageUpload,
    Indent,
    IndentBlock,
    Italic,
    Link,
    LinkImage,
    List,
    ListProperties,
    MediaEmbed,
    PageBreak,
    Paragraph,
    PasteFromOffice,
    ShowBlocks,
    SimpleUploadAdapter,
    SourceEditing,
    SpecialCharacters,
    SpecialCharactersArrows,
    SpecialCharactersCurrency,
    SpecialCharactersEssentials,
    SpecialCharactersLatin,
    SpecialCharactersMathematical,
    SpecialCharactersText,
    Table,
    TableCaption,
    TableCellProperties,
    TableColumnResize,
    TableProperties,
    TableToolbar,
    TextPartLanguage,
    TextTransformation,
    Title,
    TodoList,
    Underline,
    WordCount
} from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';
import { getEvn } from '@/helpers/getEnv';
import { showToast } from '@/helpers/showToast';
import { parse } from 'marked';

// import './App.css';

/**
 * Create a free account with a trial: https://portal.ckeditor.com/checkout?plan=free
 */
const LICENSE_KEY = 'GPL'; // or <YOUR_LICENSE_KEY>.

export default function Editor({ props }) {
    const editorContainerRef = useRef(null);
    const editorRef = useRef(null);
    const editorWordCountRef = useRef(null);
    const [isLayoutReady, setIsLayoutReady] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [editorInstance, setEditorInstance] = useState(null);

    useEffect(() => {
        setIsLayoutReady(true);

        return () => setIsLayoutReady(false);
    }, []);

    const handleGenerateWithAI = async () => {
        const blogTitle = props.blogTitle;
        
        if (!blogTitle || !blogTitle.trim()) {
            showToast('error', 'Please enter a blog title first');
            return;
        }

        if (!editorInstance) {
            showToast('error', 'Editor is not ready');
            return;
        }

        setIsGenerating(true);
        try {
            const response = await fetch(`${getEvn('VITE_API_BASE_URL')}/blog/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    prompt: blogTitle
                })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to generate content');
            }

            if (data.success) {
                // Convert Markdown to HTML and set into CKEditor
                const htmlContent = parse(data.content);
                editorInstance.setData(htmlContent);
                showToast('success', 'Content generated successfully!');
            } else {
                throw new Error('No content generated');
            }
        } catch (error) {
            //console.error('Error generating content:', error);
            showToast('error', error.message || 'Failed to generate content');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleGenerateClick = () => {
        handleGenerateWithAI();
    };

    const { editorConfig } = useMemo(() => {
        if (!isLayoutReady) {
            return {};
        }

        return {
            editorConfig: {
                toolbar: {
                    items: [
                        'sourceEditing',
                        'showBlocks',
                        'findAndReplace',
                        'textPartLanguage',
                        '|',
                        'heading',
                        '|',
                        'bold',
                        'italic',
                        'underline',
                        '|',
                        'specialCharacters',
                        'pageBreak',
                        'link',
                        'insertImage',
                        'mediaEmbed',
                        'insertTable',
                        'blockQuote',
                        'htmlEmbed',
                        '|',
                        'bulletedList',
                        'numberedList',
                        'todoList',
                        'outdent',
                        'indent'
                    ],
                    shouldNotGroupWhenFull: false
                },
                plugins: [
                    Autoformat,
                    AutoImage,
                    Autosave,
                    BalloonToolbar,
                    BlockQuote,
                    BlockToolbar,
                    Bold,
                    CloudServices,
                    Essentials,
                    FindAndReplace,
                    FullPage,
                    GeneralHtmlSupport,
                    Heading,
                    HtmlComment,
                    HtmlEmbed,
                    ImageBlock,
                    ImageCaption,
                    ImageInline,
                    ImageInsert,
                    ImageInsertViaUrl,
                    ImageResize,
                    ImageStyle,
                    ImageTextAlternative,
                    ImageToolbar,
                    ImageUpload,
                    Indent,
                    IndentBlock,
                    Italic,
                    Link,
                    LinkImage,
                    List,
                    ListProperties,
                    MediaEmbed,
                    PageBreak,
                    Paragraph,
                    PasteFromOffice,
                    ShowBlocks,
                    SimpleUploadAdapter,
                    SourceEditing,
                    SpecialCharacters,
                    SpecialCharactersArrows,
                    SpecialCharactersCurrency,
                    SpecialCharactersEssentials,
                    SpecialCharactersLatin,
                    SpecialCharactersMathematical,
                    SpecialCharactersText,
                    Table,
                    TableCaption,
                    TableCellProperties,
                    TableColumnResize,
                    TableProperties,
                    TableToolbar,
                    TextPartLanguage,
                    TextTransformation,
                    Title,
                    TodoList,
                    Underline,
                    WordCount
                ],
                balloonToolbar: ['bold', 'italic', '|', 'link', 'insertImage', '|', 'bulletedList', 'numberedList'],
                blockToolbar: [
                    'bold',
                    'italic',
                    '|',
                    'link',
                    'insertImage',
                    'insertTable',
                    '|',
                    'bulletedList',
                    'numberedList',
                    'outdent',
                    'indent'
                ],
                heading: {
                    options: [
                        {
                            model: 'paragraph',
                            title: 'Paragraph',
                            class: 'ck-heading_paragraph'
                        },
                        {
                            model: 'heading1',
                            view: 'h1',
                            title: 'Heading 1',
                            class: 'ck-heading_heading1'
                        },
                        {
                            model: 'heading2',
                            view: 'h2',
                            title: 'Heading 2',
                            class: 'ck-heading_heading2'
                        },
                        {
                            model: 'heading3',
                            view: 'h3',
                            title: 'Heading 3',
                            class: 'ck-heading_heading3'
                        },
                        {
                            model: 'heading4',
                            view: 'h4',
                            title: 'Heading 4',
                            class: 'ck-heading_heading4'
                        },
                        {
                            model: 'heading5',
                            view: 'h5',
                            title: 'Heading 5',
                            class: 'ck-heading_heading5'
                        },
                        {
                            model: 'heading6',
                            view: 'h6',
                            title: 'Heading 6',
                            class: 'ck-heading_heading6'
                        }
                    ]
                },
                htmlSupport: {
                    allow: [
                        {
                            name: /^.*$/,
                            styles: true,
                            attributes: true,
                            classes: true
                        }
                    ]
                },
                image: {
                    toolbar: [
                        'toggleImageCaption',
                        'imageTextAlternative',
                        '|',
                        'imageStyle:inline',
                        'imageStyle:wrapText',
                        'imageStyle:breakText',
                        '|',
                        'resizeImage'
                    ]
                },
                initialData: props?.initialData || '',
                licenseKey: LICENSE_KEY,
                link: {
                    addTargetToExternalLinks: true,
                    defaultProtocol: 'https://',
                    decorators: {
                        toggleDownloadable: {
                            mode: 'manual',
                            label: 'Downloadable',
                            attributes: {
                                download: 'file'
                            }
                        }
                    }
                },
                list: {
                    properties: {
                        styles: true,
                        startIndex: true,
                        reversed: true
                    }
                },
                placeholder: 'Type or paste your content here!',
                table: {
                    contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
                }
            }
        };
    }, [isLayoutReady]);

    return (
        <div className="main-container">
            <div
                className="editor-container editor-container_classic-editor editor-container_include-block-toolbar editor-container_include-word-count"
                ref={editorContainerRef}
                style={{ position: 'relative' }}
            >
                {/* Generate with AI Button - Positioned inside the editor */}
                <div style={{ 
                    position: 'absolute',
                    top: '60px', 
                    right: '10px',
                    zIndex: 1000,
                    pointerEvents: 'auto'
                }}>
                    <button
                        onClick={handleGenerateClick}
                        disabled={isGenerating}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: 'rgba(255, 255, 255, 0.15)',
                            color: '#333333',
                            borderRadius: '6px',
                            border: '1px solid rgba(147, 51, 234, 0.3)',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: '500',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                            backdropFilter: 'blur(8px)',
                            position: 'relative',
                            overflow: 'hidden',
                            opacity: isGenerating ? 0.7 : 1
                        }}
                        onMouseOver={(e) => {
                            if (!isGenerating) {
                                e.target.style.transform = 'translateY(-1px)';
                                e.target.style.boxShadow = '0 4px 12px rgba(147, 51, 234, 0.2)';
                                e.target.style.borderColor = 'rgba(147, 51, 234, 0.6)';
                            }
                        }}
                        onMouseOut={(e) => {
                            if (!isGenerating) {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                                e.target.style.borderColor = 'rgba(147, 51, 234, 0.3)';
                            }
                        }}
                    >
                        {/* Subtle animated border */}
                        <div style={{
                            position: 'absolute',
                            top: '-1px',
                            left: '-1px',
                            right: '-1px',
                            bottom: '-1px',
                            background: 'linear-gradient(45deg, rgba(147, 51, 234, 0.8), rgba(59, 130, 246, 0.8), rgba(147, 51, 234, 0.8))',
                            backgroundSize: '200% 200%',
                            borderRadius: '7px',
                            zIndex: -1,
                            animation: isGenerating ? 'none' : 'subtleShift 4s ease infinite',
                            opacity: 0.6
                        }}></div>
                        
                        {isGenerating ? 'Generating...' : 'Generate with AI'}
                    </button>
                </div>
                
                <div className="editor-container__editor">
                    <div ref={editorRef}>
                        {editorConfig && (
                            <CKEditor
                                onChange={props.onChange}
                                onReady={editor => {
                                    setEditorInstance(editor);
                                    const wordCount = editor.plugins.get('WordCount');
                                    editorWordCountRef.current.appendChild(wordCount.wordCountContainer);
                                }}
                                onAfterDestroy={() => {
                                    setEditorInstance(null);
                                    Array.from(editorWordCountRef.current.children).forEach(child => child.remove());
                                }}
                                editor={ClassicEditor}
                                config={editorConfig}
                            />
                        )}
                    </div>
                </div>
                <div className="editor_container__word-count" ref={editorWordCountRef}></div>
            </div>
            
        </div>
    );
}