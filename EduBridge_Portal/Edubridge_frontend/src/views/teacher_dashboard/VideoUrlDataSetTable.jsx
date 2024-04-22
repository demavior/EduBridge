import React from 'react';
import '../../assets/css/teacher_css/DataSetTables.scss';

const UploadVideoUrlsTable = () => {
    return (
        <div id="upload-video-url-table" className="mb-3">
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
                        <td>Video URL</td>
                        <td>CSV/JSON</td>
                        <td>The file must include the header "video_url"</td>
                        <td>
                            <pre>
                                video_url<br />
                                https://youtu.be/rHux0gMZ3Eg?si=ZP3CdJuT-YfncZCZ<br />
                            </pre>
                        </td>
                        <td>
                            <pre>
                                [
                                <br />
                                &nbsp;&nbsp;{`{`}
                                <br />
                                &nbsp;&nbsp;&nbsp;&nbsp;"video_url": https://youtu.be/rHux0gMZ3Eg?si=ZP3CdJuT-YfncZCZ,
                                ]
                            </pre>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default UploadVideoUrlsTable;
