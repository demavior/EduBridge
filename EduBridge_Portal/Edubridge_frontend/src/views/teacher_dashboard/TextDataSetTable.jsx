import React from 'react';
import '../../assets/css/teacher_css/DataSetTables.scss';

const TextTable = () => {
    return (
        <div id="upload-images-table" className="mb-3">
            <table className="table table-striped">
                <thead>
                <tr>
                    <th scope="col">Data type</th>
                    <th scope="col">File accepted</th>
                    <th scope="col">Descriptions</th>
                    <th scope="col">CSV Example</th>
                    <th scope="col">JSON Example</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>Text</td>
                    <td>CSV/JSON</td>
                    <td>The file must include the header "Text" and "text_id"</td>
                    <td>
                        <pre>
                            text_id,Text<br />
                            1,Lorem ipsum dolor sit amet<br />
                        </pre>
                    </td>
                    <td>
                        <pre>
                            [
                                <br />
                                &nbsp;&nbsp;{`{`}
                                <br />
                                &nbsp;&nbsp;&nbsp;&nbsp;"text": "Lorem ipsum dolor sit amet",
                            ]
                        </pre>
                    </td>
                </tr>
            </tbody>
            </table>
        </div>
    );
};

export default TextTable;
