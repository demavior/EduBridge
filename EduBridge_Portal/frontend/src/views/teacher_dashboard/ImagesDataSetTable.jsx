import React from 'react';
import '../../assets/css/teacher_css/DataSetTables.scss';

const Imageable = () => {
    return (
        <div id="upload-images-table" className="mb-3">
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">Data type</th>
                        <th scope="col">File accepted</th>
                        <th scope="col">Image extensions accepted</th>
                        <th scope="col">Descriptions</th>
                        <th scope="col">JSON Example</th>
                    </tr>
                </thead>
                <tbody>
                <tr>
                    <td>Images</td>
                    <td>zip</td>
                    <td>'.jpeg', '.jpg', '.png', '.gif'</td>
                    <td>The file must be a zip file with pictuers.</td>
                    <td>
                        file.zip
                    </td>
                </tr>
            </tbody>
            </table>
        </div>
    );
};

export default Imageable;
