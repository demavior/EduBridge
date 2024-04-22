import React from 'react';
import '../../assets/css/teacher_css/DataSetTables.scss';

const UploadVideoTable = () => {
    return (
        <div id="upload-video-table" className="mb-3">
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">Data type</th>
                        <th scope="col">File accepted</th>
                        <th scope="col">Descriptions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Upload Video</td>
                        <td>Upload a video</td>
                        <td>The file must be uploaded from the computer</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default UploadVideoTable;
